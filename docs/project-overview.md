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
The project is developed as a **monorepository** with the following structure:

/backend – backend API (Node.js + Express)
/frontend – web frontend
/docs – project documentation

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

## Technology Stack (Initial)
- Backend: Node.js + Express
- Frontend: Web application (to be defined)
- Documentation: Markdown files stored in `/docs`

---

## Scope Notes
- The initial version focuses on core functionality
- The data model should be flexible to allow adding new fields later
- UI and UX will be minimal and practical
