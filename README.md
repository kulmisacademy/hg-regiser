# Hoggaan Academy - Course Registration System

Link-based course registration platform for Hoggaan Academy.

## Features

- Private registration links per course, like `/register/abc123`
- No public course catalog or browsing flow
- Dynamic registration forms per course funnel
- Admin login with signed session cookie
- Course creation with image URL or image upload
- Generated link with one-click copy
- Form builder for text, phone, dropdown, and textarea fields
- Registration dashboard with totals, popularity, and recent submissions
- Registration table with course, date, and district filters
- Excel export using SheetJS
- Prisma schema for Neon PostgreSQL

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and add your Neon connection string:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/hoggaan?sslmode=require"
ADMIN_EMAIL="admin@hoggaan.academy"
ADMIN_PASSWORD="change-me"
SESSION_SECRET="replace-with-a-long-random-string"
```

3. Push the schema and seed the first admin/course:

```bash
npm run db:push
npm run db:seed
```

4. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin

Login at `/admin/login` using the email and password from `.env`.
