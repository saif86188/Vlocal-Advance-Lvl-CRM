import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { AUTH_COOKIE_NAME, verifyToken, type UserRole } from '@/lib/auth';
import User from '@/models/User';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  await connectDB();
  const user = await User.findById(payload.userId).select('name email role');
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
