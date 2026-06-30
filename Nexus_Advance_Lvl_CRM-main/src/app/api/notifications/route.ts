import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError } from '@/lib/api-response';
import { notificationCreateSchema } from '@/lib/crm-schemas';
import Notification from '@/models/Notification';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const filter: Record<string, unknown> = {};
    if (user.role === 'admin') {
      if (userId) filter.userId = new Types.ObjectId(userId);
    } else {
      filter.userId = new Types.ObjectId(user.id);
    }

    const items = await Notification.find(filter).sort({ createdAt: -1 }).lean();
    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const input = notificationCreateSchema.parse(await request.json());
    const item = await Notification.create({
      ...input,
      userId: new Types.ObjectId(input.userId),
    });
    return ok({ item }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
