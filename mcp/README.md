# Todo MCP Server

Streamable HTTP MCP server that gives an AI full CRUD access to this app's
Postgres data (tasks, projects, categories, topics, time entries).

## Tools

| Tool | Purpose |
|------|---------|
| `list_categories` / `create_category` / `delete_category` | Categories |
| `list_topics` / `create_topic` / `delete_topic` | Topics |
| `list_projects` / `create_project` / `update_project` / `delete_project` | Projects |
| `list_tasks` / `get_task` / `create_task` / `update_task` / `update_task_status` / `delete_task` | Tasks |
| `add_time_entry` / `list_time_entries` / `delete_time_entry` | Time tracking |

## Run locally (no Docker)

From `mcp/`:

```bash
cp ../.env .env   # needs DATABASE_URL
# optional: export MCP_API_KEY=some-secret
npm run start
```

Health: `http://127.0.0.1:3100/health`  
MCP: `http://127.0.0.1:3100/mcp`

## Run in Docker

From the **repo root** (uses root `.env` for `DATABASE_URL`):

```bash
# Optional shared secret for AI clients
echo 'MCP_API_KEY=change-me' >> .env

# If Postgres is on the host, point DATABASE_URL at host.docker.internal
# e.g. postgresql://user:pass@host.docker.internal:5432/todo

docker compose up -d --build mcp
curl http://127.0.0.1:3100/health
```

## Connect from Cursor

Add to Cursor MCP settings (HTTP / remote server):

```json
{
  "mcpServers": {
    "todo": {
      "url": "http://127.0.0.1:3100/mcp",
      "headers": {
        "Authorization": "Bearer change-me"
      }
    }
  }
}
```

Omit `headers` if `MCP_API_KEY` is unset. Set the same value as in `.env`.

## Env vars

| Variable | Default | Meaning |
|----------|---------|---------|
| `DATABASE_URL` | required | Postgres connection string (same DB as the Next.js app) |
| `PORT` | `3100` | Listen port |
| `HOST` | `0.0.0.0` | Bind address |
| `MCP_API_KEY` | unset | If set, require `Authorization: Bearer …` |
| `MCP_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Allowed `Host` headers (DNS-rebinding guard) |
