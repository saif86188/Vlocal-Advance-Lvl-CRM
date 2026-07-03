import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { AUTH_COOKIE_NAME, type TokenPayload, type UserRole } from '@/lib/auth-constants';

const PUBLIC_PATHS = ['/', '/login', '/register'];

interface ExtendedPayload extends TokenPayload {
  expired?: boolean;
}

async function verifyTokenEdge(token: string): Promise<ExtendedPayload | null> {
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
  } catch (error: any) {
    if (error?.code === 'ERR_JWT_EXPIRED') {
      return { expired: true } as any;
    }
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyTokenEdge(token) : null;

  // Handle public paths (/login, /register, /)
  if (PUBLIC_PATHS.includes(pathname)) {
    if (payload && !payload.expired) {
      // User is already logged in, redirect to respective dashboard
      const dashboard = payload.role === 'admin' ? '/admin' : '/client';
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    if (payload?.expired) {
      // Clear expired token
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  }

  // Handle API Auth endpoints (always public)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protect Admin paths
  if (pathname.startsWith('/admin')) {
    if (!payload || payload.expired || payload.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }
  }

  // Protect Client paths
  if (pathname.startsWith('/client')) {
    if (!payload || payload.expired || payload.role !== 'client') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/', '/login', '/register'],
};
