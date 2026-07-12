# Project Context for GitHub Copilot

## Project Overview
- **Name**: RAPHA Web-Based Laboratory Diagnostic Records and Billing System
- **Description**: A full-stack web application for managing patient records, diagnostic tests, billing, and AI-assisted diagnostic narratives.
- **Primary Users**: Receptionist, Medical Technologist, Doctor, Administrator.

## Tech Stack
- **Framework**: Next.js 14+ (using the **App Router**).
- **Frontend**: React, Tailwind CSS (utility-first), JavaScript.
- **Backend**: Next.js API Routes (Node.js runtime).
- **Database**: MySQL hosted on PlanetScale. Use **Prisma ORM** for type-safe database access and migrations.
- **AI Integration**: OpenAI API (used for the AI-Assisted Diagnostic Narrative Builder)(Don't bother with this for now, this will be implemented soon).
- **Deployment**: Vercel.
- **Version Control**: Git/GitHub.

## Folder Structure Guidelines
- **`app/`**: Contains all routing.
  - `(auth)/` for login pages (unauthenticated).
  - `(dashboard)/` for authenticated pages, further grouped by role (`admin/`, `receptionist/`, `technologist/`, `doctor/`).
  - `api/` for backend endpoints. Keep routes RESTful (e.g., `api/patients/[id]/route.js`).
- **`components/`**: Reusable UI components. Group by function (e.g., `forms/`, `tables/`, `ui/`, `narrative/`).
- **`lib/`**: Utility functions (database client, validation schemas, JWT helpers).
- **`models/`**: Prisma schema or data models. Keep relations clear (User, Patient, Test, Billing).
- **`services/`**: **Critical folder.** Contains all business logic. Keep API route handlers thin—they should parse requests, call a service, and return a response.
- **`hooks/`**: Custom React hooks for data fetching and state.
- **`middleware.js`**: Handles authentication and role-based access control (RBAC).

## Coding Conventions & Rules
1.  **API Response Format**: Always return a consistent JSON structure