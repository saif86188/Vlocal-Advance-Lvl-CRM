import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { clientUpdateSchema } from '@/lib/crm-schemas';
import User from '@/models/User';
import Client from '@/models/Client';
import Activity from '@/models/Activity';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;
    const item = await Client.findById(id).lean();
    if (!item) return err('Client not found', 404);
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const { id } = await params;
    const updates = clientUpdateSchema.parse(await request.json());
    const client = await Client.findById(id);
    if (!client) return err('Client not found', 404);

    if (updates.companyName !== undefined) client.companyName = updates.companyName;
    if (updates.contactName !== undefined) client.contactName = updates.contactName;
    if (updates.email !== undefined) client.email = updates.email.toLowerCase();
    if (updates.phone !== undefined) client.phone = updates.phone;
    if (updates.status !== undefined) client.status = updates.status;
    if (updates.industry !== undefined) client.industry = updates.industry;
    if (updates.notes !== undefined) client.notes = updates.notes;
    await client.save();

    await User.findByIdAndUpdate(client.userId, {
      ...(updates.contactName ? { name: updates.contactName } : {}),
      ...(updates.email ? { email: updates.email.toLowerCase() } : {}),
      ...(updates.phone ? { phone: updates.phone } : {}),
      ...(updates.companyName ? { company: updates.companyName } : {}),
    });

    await Activity.create({
      userId: new Types.ObjectId(admin.id),
      action: 'CLIENT_UPDATED',
      description: `Client ${client.companyName} updated`,
      entityType: 'Client',
      entityId: client._id,
      timestamp: new Date(),
    });

    return ok({ item: client });
  } catch (error) {
    return handleApiError(error);
  }
}

export const PUT = PATCH;

export async function DELETE(_: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const { id } = await params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return err('Client not found', 404);

    await User.findByIdAndDelete(client.userId);
    await Activity.create({
      userId: new Types.ObjectId(admin.id),
      action: 'CLIENT_DELETED',
      description: `Client ${client.companyName} deleted`,
      entityType: 'Client',
      entityId: client._id,
      timestamp: new Date(),
    });
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
