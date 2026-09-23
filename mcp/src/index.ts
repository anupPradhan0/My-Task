import './env.js';
import { createMcpExpressApp } from '@modelcontextprotocol/express';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler } from '@modelcontextprotocol/server';
import type { Request, Response, NextFunction } from 'express';
import { createTodoMcpServer } from './server.js';

const PORT = Number(process.env.PORT ?? 3100);
const HOST = process.env.HOST ?? '0.0.0.0';
const API_KEY = process.env.MCP_API_KEY;
const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS ?? 'localhost,127.0.0.1')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

const handler = createMcpHandler(() => createTodoMcpServer());
const node = toNodeHandler(handler);

const app = createMcpExpressApp({
  host: HOST,
  allowedHosts: ALLOWED_HOSTS,
});

function requireApiKey(req: Request, res: Response, next: NextFunction) {
  if (!API_KEY) return next();
  const header = req.headers.authorization;
  if (header === `Bearer ${API_KEY}`) return next();
  res.status(401).json({ error: 'unauthorized', message: 'Missing or invalid Bearer token' });
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, name: 'todo-mcp', version: '1.0.0' });
});

app.all('/mcp', requireApiKey, (req, res) => {
  void node(req, res, req.body);
});

app.listen(PORT, HOST, () => {
  console.log(`todo-mcp listening on http://${HOST}:${PORT}/mcp`);
  if (API_KEY) console.log('Auth: Bearer MCP_API_KEY required');
  else console.warn('Auth: MCP_API_KEY unset — endpoint is open');
});

async function shutdown() {
  await handler.close();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
