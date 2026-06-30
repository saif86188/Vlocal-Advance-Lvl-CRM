import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { clientCreateSchema } from '@/lib/crm-schemas';
import User from '@/models/User';
import Client from '@/models/Client';
import Activity from '@/models/Activity';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const status = searchParams.get('status')?.trim();
    const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') ?? '10'), 1), 50);

    const filter: Record<string, unknown> = {};
    if (status === 'active' || status === 'inactive') {
      filter.status = status;
    }
    if (q) {
      filter.$or = [
        { companyName: { $regex: q, $options: 'i' } },
        { contactName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await Client.countDocuments(filter);
    const items = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return ok({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const input = clientCreateSchema.parse(await request.json());

    let userId = input.userId;
    if (!userId) {
      if (!input.password) {
        return err('Password is required when creating a new client user', 400);
      }
      const existing = await User.findOne({ email: input.email.toLowerCase() });
      if (existing) {
        return err('Email already registered', 409);
      }
      const createdUser = await User.create({
        name: input.name,
        email: input.email,
        password: input.password,
        role: 'client',
        company: input.companyName,
        phone: input.phone,
      });
      userId = createdUser._id.toString();
    }

    const existingClient = await Client.findOne({ userId: new Types.ObjectId(userId) });
    if (existingClient) {
      return err('Client profile already exists for this user', 409);
    }

    const client = await Client.create({
      userId,
      companyName: input.companyName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      industry: input.industry,
      notes: input.notes,
      status: input.status ?? 'active',
    });

    await Activity.create({
      userId: admin.id,
      action: 'CLIENT_CREATED',
      description: `Client ${client.companyName} created`,
      entityType: 'Client',
      entityId: client._id,
      timestamp: new Date(),
    });

    return ok({ item: client }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
