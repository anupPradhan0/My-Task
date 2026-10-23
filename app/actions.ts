'use server';

import { db } from '@/db';
import { categories, topics, projects, tasks, taskTimeEntries, notes } from '@/db/schema';
import { eq, and, asc, desc, sql } from 'drizzle-orm';
import { revalidatePath, updateTag, unstable_cache } from 'next/cache';

// --- Fetchers ---

export async function getCategories() {
  return await db.select().from(categories);
}

export async function getTopics() {
  return await db.select().from(topics);
}

export async function getProjects() {
  return await db.select().from(projects).where(eq(projects.isActive, true));
}

// one round-trip for create/edit modals; cached so open isn't waiting on Postgres
export const getTaskFormOptions = unstable_cache(
  async () => {
    const [cats, tops, projs] = await Promise.all([
      db.select().from(categories),
      db.select().from(topics),
      db.select().from(projects).where(eq(projects.isActive, true)),
    ]);
    return { categories: cats, topics: tops, projects: projs };
  },
  ['task-form-options', 'v2'],
  { revalidate: 300, tags: ['task-form-options'] }
);

export async function getAllProjects() {
  return await db.select().from(projects);
}

// --- Tasks ---

export async function getTasks(filters?: { categoryId?: string; projectId?: string; status?: string; plannedDate?: string }) {
  const conditions = [];
  if (filters?.categoryId) conditions.push(eq(tasks.categoryId, filters.categoryId));
  if (filters?.projectId) conditions.push(eq(tasks.projectId, filters.projectId));
  if (filters?.status) conditions.push(eq(tasks.status, filters.status));
  if (filters?.plannedDate) conditions.push(eq(tasks.plannedDate, filters.plannedDate));

  const query = db.select({
    task: tasks,
    category: categories,
    topic: topics,
    project: projects,
    totalTime: sql<number>`COALESCE(SUM(${taskTimeEntries.durationMinutes}), 0)`.mapWith(Number)
  })
  .from(tasks)
  .leftJoin(categories, eq(tasks.categoryId, categories.id))
  .leftJoin(topics, eq(tasks.topicId, topics.id))
  .leftJoin(projects, eq(tasks.projectId, projects.id))
  .leftJoin(taskTimeEntries, eq(tasks.id, taskTimeEntries.taskId))
  .where(conditions.length ? and(...conditions) : undefined)
  .groupBy(tasks.id, categories.id, topics.id, projects.id)
  // First created stays on top; sortOrder lets users rearrange within a day
  .orderBy(asc(tasks.sortOrder), asc(tasks.createdAt));

  return await query;
}

export async function createTask(data: {
  title: string;
  description?: string;
  categoryId: string;
  topicId?: string;
  projectId?: string;
  plannedDate: string;
  isWeekly?: boolean;
}) {
  const [{ next }] = await db
    .select({ next: sql<number>`COALESCE(MAX(${tasks.sortOrder}), 0) + 1`.mapWith(Number) })
    .from(tasks);

  await db.insert(tasks).values({
    title: data.title,
    description: data.description,
    categoryId: data.categoryId,
    topicId: data.topicId || undefined,
    projectId: data.projectId || undefined,
    plannedDate: data.plannedDate,
    isWeekly: data.isWeekly ?? false,
    sortOrder: next,
  });
  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/planner');
  revalidatePath('/projects');
  revalidatePath('/analytics');
}

/** Swap sort order with the neighbor above/below in the same day (or weekly) column. */
export async function moveTask(taskId: string, direction: 'up' | 'down') {
  const [current] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  if (!current) return;

  const siblings = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.plannedDate, current.plannedDate),
        eq(tasks.isWeekly, current.isWeekly)
      )
    )
    .orderBy(asc(tasks.sortOrder), asc(tasks.createdAt));

  const index = siblings.findIndex((t) => t.id === taskId);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= siblings.length) return;

  const other = siblings[swapWith];
  await db.update(tasks).set({ sortOrder: other.sortOrder, updatedAt: new Date() }).where(eq(tasks.id, current.id));
  await db.update(tasks).set({ sortOrder: current.sortOrder, updatedAt: new Date() }).where(eq(tasks.id, other.id));

  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/planner');
  revalidatePath('/projects');
  revalidatePath('/analytics');
}

export async function editTask(taskId: string, data: {
  title: string;
  categoryId: string;
  topicId?: string;
  projectId?: string;
  plannedDate: string;
}) {
  await db.update(tasks).set({
    title: data.title,
    categoryId: data.categoryId,
    topicId: data.topicId || undefined,
    projectId: data.projectId || undefined,
    plannedDate: data.plannedDate,
    updatedAt: new Date(),
  }).where(eq(tasks.id, taskId));
  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/planner');
  revalidatePath('/projects');
  revalidatePath('/analytics');
}

export async function updateTaskStatus(taskId: string, status: string) {
  const completedAt = status === 'COMPLETED' ? new Date() : null;
  await db.update(tasks)
    .set({ status, completedAt, updatedAt: new Date() })
    .where(eq(tasks.id, taskId));
  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/planner');
  revalidatePath('/projects');
  revalidatePath('/analytics');
}

export async function deleteTask(taskId: string) {
  await db.delete(taskTimeEntries).where(eq(taskTimeEntries.taskId, taskId));
  await db.delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/planner');
  revalidatePath('/projects');
  revalidatePath('/analytics');
}

export async function addTimeEntry(taskId: string, durationMinutes: number, trackedDate: string) {
  await db.insert(taskTimeEntries).values({
    taskId,
    durationMinutes,
    trackedDate,
  });
  revalidatePath('/');
  revalidatePath('/tasks');
}

// --- Projects ---

export async function createProject(data: { name: string; description?: string }) {
  await db.insert(projects).values({ name: data.name, description: data.description });
  // Read-your-own-writes: next dropdown fetch must wait for fresh projects
  updateTag('task-form-options');
  revalidatePath('/projects');
}

export async function toggleProjectActive(projectId: string, isActive: boolean) {
  await db.update(projects).set({ isActive, updatedAt: new Date() }).where(eq(projects.id, projectId));
  updateTag('task-form-options');
  revalidatePath('/projects');
}

/** Bust form-options cache after out-of-band DB changes (seed/scripts). */
export async function refreshTaskFormOptions() {
  updateTag('task-form-options');
}

// --- Notes ---

export async function getNotes() {
  return await db.select().from(notes).orderBy(desc(notes.updatedAt), desc(notes.createdAt));
}

export async function getNote(id: string) {
  const [row] = await db.select().from(notes).where(eq(notes.id, id));
  return row ?? null;
}

export async function createNote(data?: { title?: string; content?: string }) {
  const [row] = await db
    .insert(notes)
    .values({
      title: data?.title?.trim() || 'Untitled',
      content: data?.content ?? '',
    })
    .returning();
  revalidatePath('/notes');
  return row;
}

export async function updateNote(
  id: string,
  data: { title?: string; content?: string }
) {
  const [row] = await db
    .update(notes)
    .set({
      ...(data.title !== undefined ? { title: data.title.trim() || 'Untitled' } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      updatedAt: new Date(),
    })
    .where(eq(notes.id, id))
    .returning();
  revalidatePath('/notes');
  return row ?? null;
}

export async function deleteNote(id: string) {
  await db.delete(notes).where(eq(notes.id, id));
  revalidatePath('/notes');
}
