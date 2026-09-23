import { and, desc, eq, sql } from 'drizzle-orm';
import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { db, schema } from './db.js';

const { categories, topics, projects, tasks, taskTimeEntries } = schema;

const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);

function text(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

function err(message: string) {
  return {
    isError: true as const,
    content: [{ type: 'text' as const, text: message }],
  };
}

export function registerTools(server: McpServer) {
  // --- Categories ---

  server.registerTool(
    'list_categories',
    {
      description: 'List all task categories',
      inputSchema: z.object({}),
    },
    async () => text(await db.select().from(categories).orderBy(categories.name))
  );

  server.registerTool(
    'create_category',
    {
      description: 'Create a category',
      inputSchema: z.object({
        name: z.string().min(1).describe('Category name'),
      }),
    },
    async ({ name }) => {
      const [row] = await db.insert(categories).values({ name }).returning();
      return text(row);
    }
  );

  server.registerTool(
    'delete_category',
    {
      description: 'Delete a category by id (fails if tasks still reference it)',
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }) => {
      const [row] = await db.delete(categories).where(eq(categories.id, id)).returning();
      return row ? text(row) : err(`Category not found: ${id}`);
    }
  );

  // --- Topics ---

  server.registerTool(
    'list_topics',
    {
      description: 'List topics, optionally filtered by category',
      inputSchema: z.object({
        categoryId: z.string().uuid().optional(),
      }),
    },
    async ({ categoryId }) => {
      const rows = categoryId
        ? await db.select().from(topics).where(eq(topics.categoryId, categoryId))
        : await db.select().from(topics);
      return text(rows);
    }
  );

  server.registerTool(
    'create_topic',
    {
      description: 'Create a topic under a category',
      inputSchema: z.object({
        name: z.string().min(1),
        categoryId: z.string().uuid(),
      }),
    },
    async ({ name, categoryId }) => {
      const [row] = await db.insert(topics).values({ name, categoryId }).returning();
      return text(row);
    }
  );

  server.registerTool(
    'delete_topic',
    {
      description: 'Delete a topic by id',
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }) => {
      const [row] = await db.delete(topics).where(eq(topics.id, id)).returning();
      return row ? text(row) : err(`Topic not found: ${id}`);
    }
  );

  // --- Projects ---

  server.registerTool(
    'list_projects',
    {
      description: 'List projects (active only by default)',
      inputSchema: z.object({
        includeInactive: z.boolean().optional().default(false),
      }),
    },
    async ({ includeInactive }) => {
      const rows = includeInactive
        ? await db.select().from(projects)
        : await db.select().from(projects).where(eq(projects.isActive, true));
      return text(rows);
    }
  );

  server.registerTool(
    'create_project',
    {
      description: 'Create a project',
      inputSchema: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    },
    async ({ name, description }) => {
      const [row] = await db.insert(projects).values({ name, description }).returning();
      return text(row);
    }
  );

  server.registerTool(
    'update_project',
    {
      description: 'Update a project name, description, or active flag',
      inputSchema: z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        isActive: z.boolean().optional(),
      }),
    },
    async ({ id, name, description, isActive }) => {
      const [row] = await db
        .update(projects)
        .set({
          ...(name !== undefined ? { name } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();
      return row ? text(row) : err(`Project not found: ${id}`);
    }
  );

  server.registerTool(
    'delete_project',
    {
      description: 'Delete a project by id (does not delete its tasks)',
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }) => {
      await db.update(tasks).set({ projectId: null }).where(eq(tasks.projectId, id));
      const [row] = await db.delete(projects).where(eq(projects.id, id)).returning();
      return row ? text(row) : err(`Project not found: ${id}`);
    }
  );

  // --- Tasks ---

  server.registerTool(
    'list_tasks',
    {
      description:
        'List tasks with category/topic/project and total tracked minutes. Optional filters.',
      inputSchema: z.object({
        status: statusEnum.optional(),
        categoryId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        plannedDate: z.string().optional().describe('YYYY-MM-DD'),
      }),
    },
    async ({ status, categoryId, projectId, plannedDate }) => {
      const filters = [
        status ? eq(tasks.status, status) : undefined,
        categoryId ? eq(tasks.categoryId, categoryId) : undefined,
        projectId ? eq(tasks.projectId, projectId) : undefined,
        plannedDate ? eq(tasks.plannedDate, plannedDate) : undefined,
      ].filter(Boolean);

      const rows = await db
        .select({
          task: tasks,
          category: categories,
          topic: topics,
          project: projects,
          totalTimeMinutes: sql<number>`COALESCE(SUM(${taskTimeEntries.durationMinutes}), 0)`.mapWith(
            Number
          ),
        })
        .from(tasks)
        .leftJoin(categories, eq(tasks.categoryId, categories.id))
        .leftJoin(topics, eq(tasks.topicId, topics.id))
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .leftJoin(taskTimeEntries, eq(tasks.id, taskTimeEntries.taskId))
        .where(filters.length ? and(...filters) : undefined)
        .groupBy(tasks.id, categories.id, topics.id, projects.id)
        .orderBy(desc(tasks.plannedDate));

      return text(rows);
    }
  );

  server.registerTool(
    'get_task',
    {
      description: 'Get one task by id, including time entries',
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }) => {
      const [row] = await db
        .select({
          task: tasks,
          category: categories,
          topic: topics,
          project: projects,
        })
        .from(tasks)
        .leftJoin(categories, eq(tasks.categoryId, categories.id))
        .leftJoin(topics, eq(tasks.topicId, topics.id))
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .where(eq(tasks.id, id));

      if (!row) return err(`Task not found: ${id}`);

      const timeEntries = await db
        .select()
        .from(taskTimeEntries)
        .where(eq(taskTimeEntries.taskId, id))
        .orderBy(desc(taskTimeEntries.trackedDate));

      return text({ ...row, timeEntries });
    }
  );

  server.registerTool(
    'create_task',
    {
      description: 'Create a task. Status defaults to TODO.',
      inputSchema: z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        categoryId: z.string().uuid(),
        topicId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        plannedDate: z.string().describe('YYYY-MM-DD'),
        status: statusEnum.optional().default('TODO'),
      }),
    },
    async ({ title, description, categoryId, topicId, projectId, plannedDate, status }) => {
      const [row] = await db
        .insert(tasks)
        .values({
          title,
          description,
          categoryId,
          topicId,
          projectId,
          plannedDate,
          status,
          completedAt: status === 'COMPLETED' ? new Date() : null,
        })
        .returning();
      return text(row);
    }
  );

  server.registerTool(
    'update_task',
    {
      description: 'Update task fields (partial). Use update_task_status for status-only changes.',
      inputSchema: z.object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        categoryId: z.string().uuid().optional(),
        topicId: z.string().uuid().nullable().optional(),
        projectId: z.string().uuid().nullable().optional(),
        plannedDate: z.string().optional().describe('YYYY-MM-DD'),
      }),
    },
    async ({ id, title, description, categoryId, topicId, projectId, plannedDate }) => {
      const [row] = await db
        .update(tasks)
        .set({
          ...(title !== undefined ? { title } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(categoryId !== undefined ? { categoryId } : {}),
          ...(topicId !== undefined ? { topicId } : {}),
          ...(projectId !== undefined ? { projectId } : {}),
          ...(plannedDate !== undefined ? { plannedDate } : {}),
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, id))
        .returning();
      return row ? text(row) : err(`Task not found: ${id}`);
    }
  );

  server.registerTool(
    'update_task_status',
    {
      description: 'Set task status to TODO, IN_PROGRESS, or COMPLETED',
      inputSchema: z.object({
        id: z.string().uuid(),
        status: statusEnum,
      }),
    },
    async ({ id, status }) => {
      const [row] = await db
        .update(tasks)
        .set({
          status,
          completedAt: status === 'COMPLETED' ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, id))
        .returning();
      return row ? text(row) : err(`Task not found: ${id}`);
    }
  );

  server.registerTool(
    'delete_task',
    {
      description: 'Delete a task and its time entries',
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }) => {
      await db.delete(taskTimeEntries).where(eq(taskTimeEntries.taskId, id));
      const [row] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
      return row ? text(row) : err(`Task not found: ${id}`);
    }
  );

  // --- Time entries ---

  server.registerTool(
    'add_time_entry',
    {
      description: 'Log minutes spent on a task for a given date',
      inputSchema: z.object({
        taskId: z.string().uuid(),
        durationMinutes: z.number().int().positive(),
        trackedDate: z.string().describe('YYYY-MM-DD'),
      }),
    },
    async ({ taskId, durationMinutes, trackedDate }) => {
      const [row] = await db
        .insert(taskTimeEntries)
        .values({ taskId, durationMinutes, trackedDate })
        .returning();
      return text(row);
    }
  );

  server.registerTool(
    'list_time_entries',
    {
      description: 'List time entries for a task',
      inputSchema: z.object({ taskId: z.string().uuid() }),
    },
    async ({ taskId }) => {
      const rows = await db
        .select()
        .from(taskTimeEntries)
        .where(eq(taskTimeEntries.taskId, taskId))
        .orderBy(desc(taskTimeEntries.trackedDate));
      return text(rows);
    }
  );

  server.registerTool(
    'delete_time_entry',
    {
      description: 'Delete a time entry by id',
      inputSchema: z.object({ id: z.string().uuid() }),
    },
    async ({ id }) => {
      const [row] = await db.delete(taskTimeEntries).where(eq(taskTimeEntries.id, id)).returning();
      return row ? text(row) : err(`Time entry not found: ${id}`);
    }
  );
}
