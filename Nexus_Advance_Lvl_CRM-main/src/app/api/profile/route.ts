import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/api-auth';
import { ok, handleApiError } from '@/lib/api-response';
import { z } from 'zod';
import User from '@/models/User';
import Client from '@/models/Client';

const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireAuth();
    await connectDB();
    const user = await User.findById(auth.id).select('-password').lean();
    const clientProfile = await Client.findOne({ userId: auth.id }).lean();
    return ok({ user, clientProfile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    await connectDB();
    const input = profileUpdateSchema.parse(await request.json());

    const user = await User.findByIdAndUpdate(
      auth.id,
      {
        ...(input.name ? { name: input.name } : {}),
        ...(input.company ? { company: input.company } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
      },
      { new: true }
    )
      .select('-password')
      .lean();

    if (auth.role === 'client') {
      await Client.findOneAndUpdate(
        { userId: auth.id },
        {
          ...(input.name ? { contactName: input.name } : {}),
          ...(input.company ? { companyName: input.company } : {}),
          ...(input.phone ? { phone: input.phone } : {}),
        },
        { new: true }
      );
    }

    return ok({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
