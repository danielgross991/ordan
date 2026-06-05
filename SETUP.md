# Ordan – Setup Guide

## Prerequisites

- Node.js 18+
- A Neon account (free at [neon.tech](https://neon.tech))

---

## 1. Clone and Install

```bash
git clone <your-repo>
cd ordan
npm install
cp .env.example .env.local
```

---

## 2. Configure Admin Credentials

Edit `.env.local`:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt hash>
```

To generate a bcrypt hash of your password:
```bash
node -e "require('bcryptjs').hash('your-secure-password', 10).then(console.log)"
```

Copy the output and set it as `ADMIN_PASSWORD_HASH`.

Also generate a random secret for NextAuth:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Set that as `NEXTAUTH_SECRET`.

---

## 3. Set Up Neon Postgres

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Click **New Project**, give it any name (e.g. "ordan")
3. Once created, go to the **Dashboard** tab
4. Under **Connection string**, copy the full URL — it looks like:
   ```
   postgresql://alex:password@ep-cool-darkness.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Paste it as `DATABASE_URL` in your `.env.local`

---

## 4. Create the Database Tables

Run the migration script once to create all tables:

```bash
npm run migrate
```

You should see:
```
Running schema migration...
✅  Schema applied successfully.
```

This is safe to run again — it won't delete any existing data.

---

## 5. Seed Initial Data

Populate the database with categories, regions, and sample suppliers:

```bash
npm run seed
```

This adds 7 categories, 9 regions, and 9 sample suppliers.
Safe to run on a fresh database — uses `ON CONFLICT DO NOTHING`.

---

## 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 7. Production Deployment (Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Add all environment variables from `.env.local` in Vercel project settings
4. Set `NEXTAUTH_URL` to your production domain (e.g. `https://ordan.co.il`)
5. Use the **pooled connection string** from Neon for `DATABASE_URL` on Vercel
   (in your Neon dashboard, under "Connection string", switch to "Pooled connection")
6. Deploy

---

## 8. Notes

- If `DATABASE_URL` is not set, the app runs with empty data (admin shows a warning banner)
- All data reads and writes are server-side only — the database URL is never exposed to the browser
- The `npm run migrate` script creates tables if they don't exist — safe to re-run
- To reset the database, go to your Neon dashboard and use "Reset branch"
