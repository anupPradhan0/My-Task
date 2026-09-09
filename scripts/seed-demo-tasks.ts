import { db } from '../db';
import { categories, projects, topics, tasks } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Adding demo tasks...');

  const allProjects = await db.select().from(projects);
  const allCategories = await db.select().from(categories);
  const allTopics = await db.select().from(topics);

  const yuviz = allProjects.find(p => p.name === 'Yuviz')!;
  const pipeshub = allProjects.find(p => p.name === 'PipesHub')!;
  const dograh = allProjects.find(p => p.name === 'Dograh')!;
  const other = allProjects.find(p => p.name === 'other')!;

  const projectsCat = allCategories.find(c => c.name === 'Projects')!;
  const fundamentalsCat = allCategories.find(c => c.name === 'Fundamentals')!;
  
  // Just use arbitrary dates for demo
  const getDay = (offset: number) => {
    const d = new Date('2026-09-07'); // A Monday
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const tasksToInsert = [
    // Monday
    { title: 'WorkFlow Final Test', projectId: yuviz.id, categoryId: projectsCat.id, plannedDate: getDay(0), status: 'COMPLETED' },
    { title: 'MCP Read', projectId: pipeshub.id, categoryId: projectsCat.id, plannedDate: getDay(0), status: 'TODO' },
    { title: 'Encrypt API', projectId: yuviz.id, categoryId: projectsCat.id, plannedDate: getDay(0), status: 'COMPLETED' },
    { title: 'Llm-API-key', projectId: yuviz.id, categoryId: projectsCat.id, plannedDate: getDay(0), status: 'COMPLETED' },

    // Wednesday
    { title: 'PKS data seeding', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(2), status: 'TODO' },
    { title: 'PKS color changing to red', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(2), status: 'TODO' },
    { title: 'PKS admin backend', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(2), status: 'COMPLETED' },
    { title: 'PKS UI/UX imp', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(2), status: 'COMPLETED' },
    { title: 'PKS UI/UX yellow and green', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(2), status: 'TODO' },

    // Thursday
    { title: 'PKS data seeding', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(3), status: 'COMPLETED' },

    // Friday
    { title: 'PKS color changing to red', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(4), status: 'COMPLETED' },
    { title: 'yuviz Pr cursor & Pr 5', projectId: yuviz.id, categoryId: projectsCat.id, plannedDate: getDay(4), status: 'COMPLETED' },
    { title: 'PKS data seeding of live', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(4), status: 'COMPLETED' },

    // Saturday
    { title: 'PKS UI/UX yellow and green', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(5), status: 'COMPLETED' },
    { title: 'PKS Data fix', projectId: other.id, categoryId: projectsCat.id, plannedDate: getDay(5), status: 'COMPLETED' },
    { title: 'yuviz Pr 6', projectId: yuviz.id, categoryId: projectsCat.id, plannedDate: getDay(5), status: 'COMPLETED' },

    // Weekly Tasks (Assume Sunday)
    { title: 'KB vector Pr', projectId: dograh.id, categoryId: projectsCat.id, plannedDate: getDay(6), status: 'TODO' },
    { title: 'MCP Pr', projectId: pipeshub.id, categoryId: projectsCat.id, plannedDate: getDay(6), status: 'TODO' },
    { title: 'WorkFlow Pr', projectId: yuviz.id, categoryId: projectsCat.id, plannedDate: getDay(6), status: 'COMPLETED' },
    { title: 'Learn', categoryId: fundamentalsCat.id, plannedDate: getDay(6), status: 'COMPLETED' },
  ];

  for (const t of tasksToInsert) {
    await db.insert(tasks).values({
      ...t,
      completedAt: t.status === 'COMPLETED' ? new Date() : null,
      updatedAt: new Date(),
    });
  }

  console.log('Demo tasks added successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
