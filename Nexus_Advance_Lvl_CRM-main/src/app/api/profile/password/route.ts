import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { comparePassword, hashPassword } from '@/lib/auth';
import User from '@/models/User';

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    await connectDB();
    const input = passwordSchema.parse(await request.json());

    const user = await User.findById(auth.id).select('+password');
    if (!user) return err('User not found', 404);

    const valid = await comparePassword(input.currentPassword, user.password);
    if (!valid) return err('Current password is incorrect', 401);

    user.password = input.newPassword;
    await user.save();

    return ok({ success: true }, 'Password updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
