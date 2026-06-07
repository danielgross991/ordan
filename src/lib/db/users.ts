import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'

export interface DbUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: 'pending' | 'buyer' | 'supplier'
  onboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toUser(row: any): DbUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    avatarUrl: row.avatar_url ?? null,
    role: row.role ?? 'pending',
    onboardingComplete: row.onboarding_complete ?? false,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const sql = getSql()
  if (!sql) return null
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return rows[0] ? toUser(rows[0]) : null
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const sql = getSql()
  if (!sql) return null
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return rows[0] ? toUser(rows[0]) : null
}

export async function createOrUpdateUser({
  email,
  name,
  avatarUrl,
}: {
  email: string
  name: string
  avatarUrl: string | null
}): Promise<DbUser> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')

  // Upsert: update name/avatar if user already exists, keep existing role
  const now = new Date().toISOString()
  const id = uuidv4()

  const rows = await sql`
    INSERT INTO users (id, email, name, avatar_url, role, onboarding_complete, created_at, updated_at)
    VALUES (${id}, ${email}, ${name}, ${avatarUrl}, 'pending', FALSE, ${now}, ${now})
    ON CONFLICT (email) DO UPDATE SET
      name       = COALESCE(EXCLUDED.name, users.name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
      updated_at = ${now}
    RETURNING *
  `
  return toUser(rows[0])
}

export async function updateUserRole(
  userId: string,
  role: 'buyer' | 'supplier',
): Promise<DbUser | null> {
  const sql = getSql()
  if (!sql) return null
  const now = new Date().toISOString()
  const rows = await sql`
    UPDATE users SET role = ${role}, updated_at = ${now}
    WHERE id = ${userId}
    RETURNING *
  `
  return rows[0] ? toUser(rows[0]) : null
}

export async function markOnboardingComplete(userId: string): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`
    UPDATE users SET onboarding_complete = TRUE, updated_at = NOW()
    WHERE id = ${userId}
  `
}

export interface UserListRow extends DbUser {
  favoriteCount: number
}

export async function listAllUsers(): Promise<UserListRow[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`
    SELECT u.*, COALESCE(f.cnt, 0) AS favorite_count
    FROM users u
    LEFT JOIN (
      SELECT user_id, COUNT(*)::int AS cnt FROM favorites GROUP BY user_id
    ) f ON f.user_id = u.id
    ORDER BY u.created_at DESC
  `
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((row: any) => ({ ...toUser(row), favoriteCount: Number(row.favorite_count ?? 0) }))
}

export async function deleteUserById(userId: string): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM users WHERE id = ${userId}`
}

export async function resetUserOnboarding(userId: string): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`
    UPDATE users SET role = 'pending', onboarding_complete = FALSE, updated_at = NOW()
    WHERE id = ${userId}
  `
  await sql`DELETE FROM buyer_profiles    WHERE user_id = ${userId}`
  await sql`DELETE FROM supplier_profiles WHERE user_id = ${userId}`
}
