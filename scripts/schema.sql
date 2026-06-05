-- Ordan Database Schema
-- Run once against your Neon Postgres database.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS categories (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  label_he     TEXT NOT NULL,
  description  TEXT,
  icon         TEXT,
  parent_id    TEXT REFERENCES categories(id),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS regions (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  label_he     TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS suppliers (
  id                TEXT PRIMARY KEY,
  slug              TEXT UNIQUE NOT NULL,
  business_name     TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  full_description  TEXT NOT NULL DEFAULT '',
  primary_category  TEXT NOT NULL DEFAULT '',
  subcategories     TEXT[] NOT NULL DEFAULT '{}',
  supplier_type     TEXT,
  business_fit      TEXT[] NOT NULL DEFAULT '{}',
  phone             TEXT,
  whatsapp          TEXT,
  email             TEXT,
  website           TEXT,
  address           TEXT,
  city              TEXT,
  region            TEXT,
  service_areas     TEXT[] NOT NULL DEFAULT '{}',
  opening_hours     TEXT,
  logo_url          TEXT,
  cover_image_url   TEXT,
  gallery_urls      TEXT[] NOT NULL DEFAULT '{}',
  keywords          TEXT[] NOT NULL DEFAULT '{}',
  status            TEXT NOT NULL DEFAULT 'draft',
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  force_publish     BOOLEAN NOT NULL DEFAULT FALSE,
  kashrut           TEXT,
  catalog_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
  catalog_summary   TEXT,
  source_type       TEXT,
  source_url        TEXT,
  last_verified_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issue_reports (
  id             TEXT PRIMARY KEY,
  supplier_id    TEXT NOT NULL,
  supplier_name  TEXT NOT NULL,
  issue_type     TEXT NOT NULL,
  description    TEXT NOT NULL,
  reporter_name  TEXT,
  reporter_email TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status         TEXT NOT NULL DEFAULT 'new',
  admin_notes    TEXT
);

CREATE TABLE IF NOT EXISTS import_logs (
  id               TEXT PRIMARY KEY,
  import_type      TEXT NOT NULL,
  source           TEXT NOT NULL,
  records_imported INTEGER NOT NULL DEFAULT 0,
  records_skipped  INTEGER NOT NULL DEFAULT 0,
  imported_by      TEXT NOT NULL,
  imported_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes            TEXT NOT NULL DEFAULT ''
);

-- ── User accounts (Google OAuth) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  TEXT PRIMARY KEY,          -- Google sub / UUID
  email               TEXT NOT NULL UNIQUE,
  name                TEXT,
  avatar_url          TEXT,
  role                TEXT NOT NULL DEFAULT 'pending', -- pending | buyer | supplier
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Buyer profiles (extra data collected during onboarding) ─────────────────
CREATE TABLE IF NOT EXISTS buyer_profiles (
  user_id              TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name        TEXT,
  business_type        TEXT,   -- restaurant | cafe | hotel | catering | bakery | institution
  city                 TEXT,
  region               TEXT,
  category_preferences TEXT[] NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Supplier claims (link Google user to a supplier profile) ─────────────────
CREATE TABLE IF NOT EXISTS supplier_claims (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, supplier_id)
);

-- ── Favorites / My Suppliers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, supplier_id)
);

-- ── Supplier engagement events ───────────────────────────────────────────────
-- event_type: view | card_click | phone_click | wa_click | website_click | email_click | save | unsave
CREATE TABLE IF NOT EXISTS supplier_events (
  id          TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,  -- null = anonymous
  event_type  TEXT NOT NULL,
  session_id  TEXT,             -- anonymous session fingerprint
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Additive column migrations (safe to re-run) ──────────────────────────────
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS force_publish BOOLEAN NOT NULL DEFAULT FALSE;

-- ── Useful indexes ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_suppliers_status    ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_slug      ON suppliers(slug);
CREATE INDEX IF NOT EXISTS idx_suppliers_category  ON suppliers(primary_category);
CREATE INDEX IF NOT EXISTS idx_suppliers_region    ON suppliers(region);
CREATE INDEX IF NOT EXISTS idx_reports_status      ON issue_reports(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user      ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_supplier  ON favorites(supplier_id);
CREATE INDEX IF NOT EXISTS idx_events_supplier     ON supplier_events(supplier_id);
CREATE INDEX IF NOT EXISTS idx_events_type         ON supplier_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created      ON supplier_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
