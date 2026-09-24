import type { AuthInfo } from '@modelcontextprotocol/server';
import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import { registerTools } from '@/lib/mcp/tools';
import { safeEqual } from '@/lib/site-auth';

const mcpHandler = createMcpHandler((server) => {
  registerTools(server);
});

const apiKey = process.env.MCP_API_KEY;

async function verifyToken(
  _req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> {
  if (!apiKey || !bearerToken) return undefined;
  const [got, expected] = await Promise.all([
    hashPassword(bearerToken),
    hashPassword(apiKey),
  ]);
  if (!safeEqual(got, expected)) return undefined;
  return {
    token: bearerToken,
    clientId: 'mcp-client',
    scopes: ['todo'],
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
}

// Always require a Bearer token. Set MCP_API_KEY on Vercel — if missing, all MCP calls 401.
export const handler = withMcpAuth(mcpHandler, verifyToken, {
  required: true,
  requiredScopes: ['todo'],
});
