# WebApp Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/shared/types/package.json ./packages/shared/types/
COPY packages/shared/utils/package.json ./packages/shared/utils/

RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm --filter webapp build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/webapp/public ./packages/webapp/public
COPY --from=builder --chown=nextjs:nodejs /app/packages/webapp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/webapp/.next/static ./packages/webapp/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "packages/webapp/server.js"]
