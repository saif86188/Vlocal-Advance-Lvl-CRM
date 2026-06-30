import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth';

export type SafeUser = Pick<
  IUser,
  | 'name'
  | 'email'
  | 'role'
  | 'company'
  | 'phone'
  | 'avatarUrl'
  | 'teamRole'
  | 'activeProjects'
  | 'createdAt'
  | 'updatedAt'
> & {
  id: string;
};

function toSafeUser(user: IUser): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    teamRole: user.teamRole,
    activeProjects: user.activeProjects,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getServerUser(): Promise<SafeUser | null> {
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

  const user = await User.findById(payload.userId).select('-password');
  if (!user) {
    return null;
  }

  return toSafeUser(user);
}
