import { pgTable, uuid, varchar, text, timestamp, boolean, integer, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  topicId: uuid('topic_id').references(() => topics.id),
  projectId: uuid('project_id').references(() => projects.id),
  status: varchar('status', { length: 50 }).notNull().default('TODO'), // TODO, IN_PROGRESS, COMPLETED
  plannedDate: date('planned_date').notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taskTimeEntries = pgTable('task_time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  trackedDate: date('tracked_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  topics: many(topics),
  tasks: many(tasks),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  category: one(categories, {
    fields: [topics.categoryId],
    references: [categories.id],
  }),
  tasks: many(tasks),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
  topic: one(topics, {
    fields: [tasks.topicId],
    references: [topics.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  timeEntries: many(taskTimeEntries),
}));

export const taskTimeEntriesRelations = relations(taskTimeEntries, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTimeEntries.taskId],
    references: [tasks.id],
  }),
}));

// Keep in sync with ../../db/schema.ts (same Postgres tables).
