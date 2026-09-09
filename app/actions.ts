'use server';

import { db } from '@/db';
import { categories, topics, projects, tasks, taskTimeEntries } from '@/db/schema';
import { eq, and, gte, lte, desc, asc, sum, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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

export async function getAllProjects() {
  return await db.select().from(projects);
}

// --- Tasks ---

export async function getTasks(filters?: { categoryId?: string; projectId?: string; status?: string; plannedDate?: string }) {
  let query = db.select({
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
  .groupBy(tasks.id, categories.id, topics.id, projects.id);

  // basic filtering in JS or SQL. For simplicity, we'll fetch all and filter in UI for small scale, 
  // but let's add basic SQL filters.
  return await query;
}

export async function createTask(data: {
  title: string;
  description?: string;
  categoryId: string;
  topicId?: string;
  projectId?: string;
  plannedDate: string;
}) {
  await db.insert(tasks).values({
    title: data.title,
    description: data.description,
    categoryId: data.categoryId,
    topicId: data.topicId || undefined,
    projectId: data.projectId || undefined,
    plannedDate: data.plannedDate,
  });
  revalidatePath('/');
  revalidatePath('/tasks');
  revalidatePath('/planner');
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
  revalidatePath('/projects');
}

export async function toggleProjectActive(projectId: string, isActive: boolean) {
  await db.update(projects).set({ isActive, updatedAt: new Date() }).where(eq(projects.id, projectId));
  revalidatePath('/projects');
}
