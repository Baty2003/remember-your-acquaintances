# Backend

Backend API for Remember Your Acquaintances built with Fastify + TypeScript.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 20+ installed

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

### Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

### Running the Server

Development mode (with hot reload):

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Available Endpoints

### General

| Method | Endpoint  | Description          |
|--------|-----------|----------------------|
| GET    | /health   | Health check         |
| GET    | /api      | API welcome message  |

### Authentication

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| POST   | /api/auth/register | Register a new user      | No            |
| POST   | /api/auth/login    | Login with credentials   | No            |
| GET    | /api/auth/me       | Get current user profile | Yes           |

### Request/Response Examples

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "myuser", "password": "mypassword"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "myuser", "password": "mypassword"}'
```

**Get Profile (with token):**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Prisma schema
├── src/
│   ├── config/           # Configuration
│   │   └── env.ts        # Environment variables
│   ├── generated/        # Generated Prisma client
│   ├── lib/              # Shared libraries
│   │   └── prisma.ts     # Prisma client instance
│   ├── plugins/          # Fastify plugins
│   │   └── auth.plugin.ts
│   ├── routes/           # API routes
│   │   └── auth.routes.ts
│   ├── services/         # Business logic
│   │   └── auth.service.ts
│   ├── app.ts            # Fastify app setup
│   └── index.ts          # Entry point
├── .env                  # Environment variables (not committed)
├── .env.example          # Environment template
├── package.json
├── prisma.config.ts      # Prisma CLI config
└── tsconfig.json
```

## Next Steps

- [x] Add database (Prisma + SQLite)
- [x] Add authentication (JWT)
- [ ] Add contact routes
- [ ] Add notes routes
- [ ] Add tags routes
