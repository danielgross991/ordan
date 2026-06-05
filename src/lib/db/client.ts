/**
 * Neon Postgres client — server-side only.
 * Returns null when DATABASE_URL is not configured (graceful fallback).
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

type SqlFn = NeonQueryFunction<false, false>

let _sql: SqlFn | null = null

export function getSql(): SqlFn | null {
  if (!process.env.DATABASE_URL) {
    if (process.env.VERCEL_ENV === 'production' || process.env.ORDAN_ENFORCE_PROD_ENV === 'true') {
      throw new Error('DATABASE_URL is required in production')
    }
    return null
  }
  if (!_sql) _sql = neon(process.env.DATABASE_URL)
  return _sql
}

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL
}
