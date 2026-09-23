import { McpServer } from '@modelcontextprotocol/server';
import { registerTools } from './tools.js';

export function createTodoMcpServer() {
  const server = new McpServer({
    name: 'todo-mcp',
    version: '1.0.0',
  });
  registerTools(server);
  return server;
}
