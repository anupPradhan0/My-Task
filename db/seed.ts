import { db } from './index';
import { categories, topics, projects, tasks } from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Seeding started...');

  const [fundamentals, dsa, projectsCat] = await db.insert(categories).values([
    { name: 'Fundamentals' },
    { name: 'DSA' },
    { name: 'Projects' },
    { name: 'Other' },
  ]).returning();

  const topicNames = [
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
    topicNames.map(name => ({ name, categoryId: fundamentals.id }))
  );

  await db.insert(projects).values([
    { name: 'Yuviz', description: 'Voice AI platform: STT -> LLM (tool-calling, RAG, transfer) -> TTS, over real SIP telephony or browser-based testing' },
    { name: 'PipesHub', description: 'PipesHub is an open-source platform for securely connecting enterprise knowledge to AI. Give AI agents trusted context and your team permission-aware search with verified citations across your business systems.' },
    { name: 'Dograh', description: 'Open source voice AI platform. Self-hosted alternative to Vapi and Retell. On Prem, BYOK across Speech to Speech or LLM/STT/TTS, with a visual workflow builder, MCP native and telephony support.' },
    { name: 'noburner', description: 'A temp email, like the temporary email detection project.' },
    { name: 'other', description: 'othere projects some temporey one adn all ok' }
  ]);

  console.log('Seeding finished.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
