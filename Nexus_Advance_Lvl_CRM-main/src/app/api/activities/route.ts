import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/api-auth';
import { ok, handleApiError } from '@/lib/api-response';
import Activity from '@/models/Activity';
import Client from '@/models/Client';

export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (user.role === 'client') {
      const clientProfile = await Client.findOne({ userId: new Types.ObjectId(user.id) }).select('_id');
      filter.$or = [
        { userId: new Types.ObjectId(user.id) },
        { entityType: 'Project', entityId: clientProfile?._id },
      ];
    }

    const items = await Activity.find(filter).sort({ timestamp: -1 }).limit(50).lean();
    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
