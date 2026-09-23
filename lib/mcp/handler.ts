import type { AuthInfo } from '@modelcontextprotocol/server';
import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import { registerTools } from '@/lib/mcp/tools';

const mcpHandler = createMcpHandler((server) => {
  registerTools(server);
});

const apiKey = process.env.MCP_API_KEY;

async function verifyToken(
  _req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> {
  if (!apiKey) {
    return {
      token: bearerToken ?? 'anonymous',
      clientId: 'anonymous',
      scopes: ['todo'],
      expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
  }
  if (!bearerToken || bearerToken !== apiKey) return undefined;
  return {
    token: bearerToken,
    clientId: 'mcp-client',
    scopes: ['todo'],
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
}

export const handler = withMcpAuth(mcpHandler, verifyToken, {
  required: Boolean(apiKey),
  requiredScopes: apiKey ? ['todo'] : [],
});
