import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getJwtSecret } from './env';
import {
  AUTH_COOKIE_NAME,
  TOKEN_MAX_AGE_SECONDS,
  type TokenPayload,
} from './auth-constants';

export { AUTH_COOKIE_NAME, TOKEN_MAX_AGE_SECONDS, type TokenPayload, type UserRole } from './auth-constants';

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('userId' in decoded) ||
      !('email' in decoded) ||
      !('role' in decoded)
    ) {
      return null;
    }

    return decoded as TokenPayload;
  } catch (error: any) {
    if (error?.name === 'TokenExpiredError') {
      throw new Error('TOKEN_EXPIRED');
    }
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: TOKEN_MAX_AGE_SECONDS,
    path: '/',
  };
}
