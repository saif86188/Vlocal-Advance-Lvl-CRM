import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { notificationUpdateSchema } from '@/lib/crm-schemas';
import Notification from '@/models/Notification';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const item = await Notification.findById(id).lean();
    if (!item) return err('Notification not found', 404);
    if (user.role !== 'admin' && item.userId.toString() !== user.id) return err('Forbidden', 403);
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const updates = notificationUpdateSchema.parse(await request.json());

    const item = await Notification.findById(id);
    if (!item) return err('Notification not found', 404);
    if (user.role !== 'admin' && item.userId.toString() !== user.id) return err('Forbidden', 403);

    if (updates.title !== undefined) item.title = updates.title;
    if (updates.message !== undefined) item.message = updates.message;
    if (updates.type !== undefined) item.type = updates.type;
    if (updates.read !== undefined) item.read = updates.read;
    if (updates.userId !== undefined && user.role === 'admin') {
      item.userId = new Types.ObjectId(updates.userId);
    }
    await item.save();
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export const PUT = PATCH;

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const item = await Notification.findById(id);
    if (!item) return err('Notification not found', 404);
    if (user.role !== 'admin' && item.userId.toString() !== user.id) return err('Forbidden', 403);
    await Notification.findByIdAndDelete(id);
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
