# Project Overview

## Project Name
Personal Contacts Management Application

## Goal
The goal of this project is to develop a web application that allows me to store, manage, and review information about people I meet.

The application is designed for personal use at first, with the possibility of future expansion.

---

## Core Idea
The application allows creating and managing **contacts** (people), each containing:
- basic personal information
- context of how and where we met
- tags for categorization
- notes (personal journal entries)
- optional photo

The system should help recall people, interactions, and important details over time.

---

## Platform
- Web application (initial version)
- Backend API designed to be reusable for future clients (e.g. Android app)

---

## Repository Structure
The project is developed as a **monorepository** using npm workspaces:

```
/
├── backend/     – Backend API (Fastify + TypeScript)
├── frontend/    – Web frontend (to be defined)
├── docs/        – Project documentation
└── package.json – Root workspace config
```

---

## Core Features (Initial Version)
- User authentication (login page)
- Dashboard with list of contacts
- Create, edit, and view contacts
- Tags for filtering and grouping contacts
- Notes (multiple per contact)
- Sorting and filtering on dashboard
- Upload a single photo per contact

---

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Kit**: Ant Design
- **Architecture**: Classic MVC-like (organized by type)

### Documentation
- Markdown files stored in `/docs`

---

## Frontend Architecture

The frontend follows a **Classic MVC-like architecture**, organizing code by file type rather than by feature.

```
frontend/src/
├── components/       # Reusable UI components
│   ├── auth/         # Auth-related components
│   ├── common/       # Common components (Logo, etc.)
│   └── layout/       # Layout components
├── pages/            # Page components (route entry points)
├── services/         # API calls and external services
├── store/            # Redux store and slices
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── assets/           # Static assets (images, fonts)
├── router.tsx        # React Router configuration
└── main.tsx          # App entry point
```

Folder purposes:
- `components/` – Reusable UI components organized by domain
- `pages/` – Page-level components corresponding to routes
- `services/` – API client and service functions
- `store/` – Redux Toolkit store and slices
- `hooks/` – Custom React hooks
- `types/` – TypeScript type definitions

---

## Scope Notes
- The initial version focuses on core functionality
- The data model should be flexible to allow adding new fields later
- UI and UX will be minimal and practical
