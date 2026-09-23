# Build from repo root: docker build -f mcp/Dockerfile .
FROM node:22-alpine AS deps
WORKDIR /app
COPY mcp/package.json mcp/package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3100

COPY --from=deps /app/node_modules ./node_modules
COPY mcp/package.json mcp/tsconfig.json ./
COPY mcp/src ./src

EXPOSE 3100
USER node
CMD ["npx", "tsx", "src/index.ts"]
