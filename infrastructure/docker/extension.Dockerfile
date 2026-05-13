# Extension Builder Dockerfile
FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/extension/package.json ./packages/extension/
COPY packages/shared/*/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter extension build

# Output stage - just copy the built extension
FROM scratch AS output
COPY --from=builder /app/packages/extension/dist /dist
