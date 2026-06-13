import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getAuthSecret } from '@/lib/env';

export type AdminSession = {
  id: string;
  email: string;
  role: string;
};

export class AuthError extends Error {
  status = 401;
  constructor(message = 'غير مصرح') {
    super(message);
    this.name = 'AuthError';
  }
}

const COOKIE_NAME = 'admin_session';

export async function createSession(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getAuthSecret());
}

export async function verifySessionToken(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (payload.role !== 'ADMIN' || !payload.id || !payload.email) return null;
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export async function readSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== 'ADMIN') throw new AuthError();
  return session;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}
