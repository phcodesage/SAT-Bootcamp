import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

export interface AdminPayload {
  username: string;
  role: 'admin';
}

export function signAdminToken(username: string): string {
  return jwt.sign({ username, role: 'admin' } satisfies AdminPayload, JWT_SECRET, {
    expiresIn: '8h',
  });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export function checkAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

/** Server-side: reads the auth cookie and returns the payload or null */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
