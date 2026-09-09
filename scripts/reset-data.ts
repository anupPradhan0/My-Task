import { db } from '../db';
import { categories, topics, projects, tasks, taskTimeEntries } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Resetting data...');

  // 1. Delete existing data
  await db.delete(taskTimeEntries);
  await db.delete(tasks);
  await db.delete(topics);
  await db.delete(projects);
  // Do we delete categories? We can just keep them or delete and recreate.
  await db.delete(categories);

  // 2. Insert Categories
  const [fundamentals, dsa, projectsCat] = await db.insert(categories).values([
    { name: 'Fundamentals' },
    { name: 'DSA' },
    { name: 'Projects' },
  ]).returning();

  // 3. Insert Topics for Fundamentals
  const newTopics = [
    'OOP concepts',
    'DBMS / SQL',
    'Operating Systems',
    'Computer Networks',
    'System Design (LLD + HLD)',
    'Git/Version Control',
    'Design Patterns',
    'Testing (unit/integration)',
    'Web fundamentals (HTTP, REST, APIs)'
  ];

  await db.insert(topics).values(
    newTopics.map(name => ({ name, categoryId: fundamentals.id }))
  );

  // 4. Insert Projects
  const newProjects = [
    { 
      name: 'Yuviz', 
      description: 'Voice AI platform: STT -> LLM (tool-calling, RAG, transfer) -> TTS, over real SIP telephony or browser-based testing' 
    },
    { 
      name: 'PipesHub', 
      description: 'PipesHub is an open-source platform for securely connecting enterprise knowledge to AI. Give AI agents trusted context and your team permission-aware search with verified citations across your business systems.' 
    },
    { 
      name: 'Dograh', 
      description: 'Open source voice AI platform. Self-hosted alternative to Vapi and Retell. On Prem, BYOK across Speech to Speech or LLM/STT/TTS, with a visual workflow builder, MCP native and telephony support.' 
    },
    { 
      name: 'noburner', 
      description: 'A temp email, like the temporary email detection project.' 
    },
    { 
      name: 'other', 
      description: 'othere projects some temporey one adn all ok' 
    }
  ];

  await db.insert(projects).values(newProjects);

  console.log('Data successfully reset and new items added.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
