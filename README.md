# Remember Your Acquaintances

A personal contacts management application to store, manage, and review information about people you meet.

## Project Structure

This is a monorepo using npm workspaces:

```
/
├── backend/     # Fastify + TypeScript API
├── frontend/    # Web frontend (TBD)
├── docs/        # Project documentation
└── package.json # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 20+

### Installation

```bash
# Install all dependencies (backend + frontend)
npm install
```

### Development

```bash
# Run backend
npm run dev:backend

# Run frontend (when available)
npm run dev:frontend
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend dev server |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build:backend` | Build backend for production |
| `npm run build:frontend` | Build frontend for production |
| `npm run lint` | Lint all packages |
| `npm run format` | Format all packages |

### Working with specific packages

```bash
# Run any script in a specific workspace
npm run <script> -w backend
npm run <script> -w frontend

# Install a dependency in a specific workspace
npm install <package> -w backend
```

## Documentation

See the [docs/](./docs) folder for detailed documentation:

- [Project Overview](./docs/project-overview.md)
- [Main Entities](./docs/main-entities.md)
- [Screens](./docs/screens.md)
