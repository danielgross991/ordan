/**
 * Run the database schema against Neon Postgres.
 * Usage: npm run migrate
 *
 * Safe to run multiple times — uses CREATE TABLE IF NOT EXISTS.
 */
import { readFileSync } from 'fs'
import { join } from 'path'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config({ path: join(process.cwd(), '.env.local') })

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  const sql = neon(url)
  const schema = readFileSync(join(process.cwd(), 'scripts/schema.sql'), 'utf-8')

  // Split on semicolons; strip comment lines from each chunk, then drop empty results
  const statements = schema
    .split(';')
    .map(chunk =>
      chunk
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter(s => s.length > 0)

  console.log('Running schema migration...')
  let applied = 0
  for (const statement of statements) {
    // sql.unsafe() embeds raw SQL into a template literal — the whole query is the raw string
    await sql`${sql.unsafe(statement)}`
    applied++
  }
  console.log(`Schema applied successfully. (${applied} statements)`)
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
