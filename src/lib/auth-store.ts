import { query } from "@/lib/db";

export type DbUser = {
  id: number;
  email: string;
  full_name: string | null;
  company_name: string | null;
  password_hash: string;
  created_at: Date;
};

let schemaReadyPromise: Promise<void> | null = null;

export async function ensureAuthSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          full_name TEXT,
          company_name TEXT,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash TEXT NOT NULL UNIQUE,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await query(`
        CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
        ON password_reset_tokens(user_id);
      `);
    })();
  }

  await schemaReadyPromise;
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  await ensureAuthSchema();
  const result = await query<DbUser>(
    `SELECT id, email, full_name, company_name, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()],
  );

  return result.rows[0] ?? null;
}

export async function findUserById(id: number): Promise<DbUser | null> {
  await ensureAuthSchema();
  const result = await query<DbUser>(
    `SELECT id, email, full_name, company_name, password_hash, created_at
     FROM users
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function createUser(input: {
  email: string;
  fullName: string;
  companyName: string;
  passwordHash: string;
}) {
  await ensureAuthSchema();

  const result = await query<Pick<DbUser, "id" | "email" | "full_name" | "company_name">>(
    `INSERT INTO users (email, full_name, company_name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, company_name`,
    [input.email.toLowerCase(), input.fullName, input.companyName, input.passwordHash],
  );
  return result.rows[0];
}

export async function savePasswordResetToken(input: {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}) {
  await ensureAuthSchema();
  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [input.userId, input.tokenHash, input.expiresAt],
  );
}

export async function consumePasswordResetToken(tokenHash: string) {
  await ensureAuthSchema();
  const result = await query<{ id: number; user_id: number; expires_at: Date; used_at: Date | null }>(
    `SELECT id, user_id, expires_at, used_at
     FROM password_reset_tokens
     WHERE token_hash = $1`,
    [tokenHash],
  );

  const token = result.rows[0];
  if (!token) {
    return null;
  }

  const expired = token.expires_at.getTime() < Date.now();
  if (token.used_at || expired) {
    return null;
  }

  await query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`, [token.id]);
  return token;
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  await ensureAuthSchema();
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [passwordHash, userId]);
}
