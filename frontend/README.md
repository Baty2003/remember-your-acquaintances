# Frontend

Web frontend for Remember Your Acquaintances built with React + TypeScript + Ant Design.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Kit**: Ant Design
- **Routing**: React Router
- **HTTP Client**: Axios

## Architecture

This project uses a **Classic MVC-like architecture** organized by file type:

```
src/
├── components/         # Reusable UI components
│   ├── auth/           # Auth-related components
│   ├── common/         # Common components (Logo, etc.)
│   └── layout/         # Layout components (AppLayout, ProtectedRoute)
├── pages/              # Page components (route entry points)
├── services/           # API calls and external services
├── store/              # Redux store and slices
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── assets/             # Static assets (images, fonts)
├── router.tsx          # React Router configuration
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 20+
- Backend running on port 8080

### Development

From the root of the monorepo:

```bash
# Install dependencies
npm install

# Run frontend
npm run dev:frontend
```

Or from the frontend folder:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:8080
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Folder Structure Details

### `/components`
Reusable UI components organized by domain:
- `auth/` - Login form, register form
- `common/` - Logo, buttons, shared UI
- `layout/` - App layout, protected route wrapper

### `/pages`
Page-level components that correspond to routes:
- `LoginPage.tsx`
- `DashboardPage.tsx`
- (future) `ContactsPage.tsx`, `ContactDetailPage.tsx`

### `/services`
API client and service functions:
- `apiClient.ts` - Axios instance with interceptors
- `authService.ts` - Auth API calls

### `/store`
Redux Toolkit store configuration and slices:
- `index.ts` - Store configuration
- `authSlice.ts` - Auth state management

### `/hooks`
Custom React hooks:
- `useAppDispatch` - Typed dispatch hook
- `useAppSelector` - Typed selector hook

### `/types`
TypeScript type definitions:
- `auth.ts` - User, AuthState, LoginCredentials, etc.
