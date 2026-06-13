import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('admin_session')?.value;
    const secret = getSecret();

    if (!token || !secret) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'ADMIN') throw new Error('Invalid role');
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', req.url));
      res.cookies.delete('admin_session');
      return res;
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
