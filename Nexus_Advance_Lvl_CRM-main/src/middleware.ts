import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { AUTH_COOKIE_NAME, type TokenPayload, type UserRole } from '@/lib/auth-constants';

const PUBLIC_PATHS = ['/', '/login', '/register'];

async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      (payload.role !== 'admin' && payload.role !== 'client')
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyTokenEdge(token) : null;

  if (pathname.startsWith('/admin')) {
    if (!payload || payload.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/client')) {
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
};
