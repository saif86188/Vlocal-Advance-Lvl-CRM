export const AUTH_COOKIE_NAME = 'CODEVATE_token';
export const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type UserRole = 'admin' | 'client';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}
