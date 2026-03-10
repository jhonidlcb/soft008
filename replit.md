# SoftwarePar - Partner Tecnológico en Paraguay

## Overview
Full-stack web application for SoftwarePar, a Paraguayan software company. Features include project management, electronic invoicing (SIFEN), partner management, portfolio, ticketing, and more.

## Architecture
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui components
- **Backend**: Express.js (TypeScript) serving both API and frontend
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Routing**: Wouter (client-side), Express (server-side API)

## Project Structure
```
client/          - React frontend (Vite)
  src/
    components/  - UI components (shadcn/ui based)
    pages/       - Page components
    contexts/    - React contexts
    hooks/       - Custom hooks
    lib/         - Utilities
server/          - Express backend
  index.ts       - Server entry point
  routes.ts      - API routes
  db.ts          - Database connection (Drizzle + Neon)
  auth.ts        - JWT authentication
  email.ts       - Email via Nodemailer/Gmail
  facturasend.ts - Electronic invoicing integration
  sifen.ts       - SIFEN (Paraguay tax system)
shared/
  schema.ts      - Drizzle database schema
```

## Key Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run db:push` - Push schema changes to database

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `GMAIL_USER` / `GMAIL_PASS` - Email sending credentials
- `FACTURASEND_API_KEY` - Electronic invoicing API
- `RECAPTCHA_SECRET_KEY` / `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA
- `JWT_SECRET` - JWT signing key (auto-generated in dev if not set)

## Recent Changes
- 2026-03-04: Replit import setup - PostgreSQL database provisioned, npm dependencies installed, schema pushed, workflow configured on port 5000, deployment configured (autoscale)
