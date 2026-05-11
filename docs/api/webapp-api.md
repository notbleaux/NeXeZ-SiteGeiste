# WebApp API Documentation

## Base URL

```
Development: http://localhost:3000/api
Staging: https://staging.nexez-sitegeiste.com/api
Production: https://nexez-sitegeiste.com/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "level": 1,
    "xp": 0
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login

Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "level": 1,
    "xp": 0
  },
  "token": "jwt_token_here"
}
```

### Quests

#### GET /api/quests

Get list of available quests.

**Query Parameters:**
- `level`: Filter by quest level (beginner, intermediate, advanced, epic)
- `status`: Filter by status (open, in_progress, completed)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "quests": [
    {
      "id": "uuid",
      "title": "Fix Documentation Typo",
      "description": "Update setup guide with correct information",
      "level": "beginner",
      "xpReward": 10,
      "status": "open",
      "createdAt": "2026-05-11T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### POST /api/quests/:id/claim

Claim a quest to work on.

**Response:** `200 OK`
```json
{
  "quest": {
    "id": "uuid",
    "status": "in_progress",
    "assignedTo": "user_id"
  }
}
```

### Achievements

#### GET /api/achievements

Get user achievements.

**Response:** `200 OK`
```json
{
  "achievements": [
    {
      "id": "uuid",
      "name": "First Steps",
      "description": "Made your first commit",
      "icon": "👣",
      "xpValue": 10,
      "unlockedAt": "2026-05-11T00:00:00Z"
    }
  ]
}
```

### AI Agents

#### POST /api/ai/chat

Chat with an AI agent.

**Request Body:**
```json
{
  "agentId": "code-reviewer",
  "message": "Can you review this code?",
  "context": {
    "code": "function example() { ... }",
    "language": "typescript"
  }
}
```

**Response:** `200 OK` (Streaming)
```json
{
  "response": "I'd be happy to review your code...",
  "agentId": "code-reviewer",
  "suggestions": []
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## Rate Limiting

- 100 requests per 15 minutes per user
- 1000 requests per 15 minutes per IP
- AI endpoints: 20 requests per minute

Rate limit info in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```
