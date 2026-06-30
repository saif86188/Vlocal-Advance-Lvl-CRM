import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError } from '@/lib/api-response';
import { taskCreateSchema } from '@/lib/crm-schemas';
import Task from '@/models/Task';
import Activity from '@/models/Activity';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const filter: Record<string, unknown> = {};

    if (user.role === 'client') {
      filter.clientId = new Types.ObjectId(user.id);
    }
    if (projectId) {
      filter.projectId = new Types.ObjectId(projectId);
    }

    const items = await Task.find(filter).sort({ createdAt: -1 }).lean();
    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const input = taskCreateSchema.parse(await request.json());
    const task = await Task.create({
      ...input,
      projectId: new Types.ObjectId(input.projectId),
      clientId: new Types.ObjectId(input.clientId),
      assignedTo: input.assignedTo ? new Types.ObjectId(input.assignedTo) : undefined,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      completedAt: input.status === 'completed' ? new Date() : undefined,
    });

    await Activity.create({
      userId: new Types.ObjectId(admin.id),
      action: 'TASK_CREATED',
      description: `Task ${task.title} created`,
      entityType: 'Task',
      entityId: task._id,
      timestamp: new Date(),
    });

    return ok({ item: task }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
