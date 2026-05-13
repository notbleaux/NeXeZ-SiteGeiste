# Backend Services

Microservices backend for NeXeZ SiteGeiste.

## Services

- **api-gateway**: Request routing and authentication
- **ai-service**: AI integration (OpenAI, Claude, Deepseek)
- **auth-service**: User authentication and authorization
- **project-service**: Project management logic
- **game-engine-service**: Gamification and XP system
- **storage-service**: File uploads and asset management

## Tech Stack

- Node.js with NestJS
- PostgreSQL database
- Redis for caching
- GraphQL API

## Development

```bash
# Start all services
pnpm --filter './packages/backend/**' dev

# Start specific service
pnpm --filter api-gateway dev
```
