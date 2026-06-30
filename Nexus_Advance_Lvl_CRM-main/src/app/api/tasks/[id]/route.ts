import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { taskUpdateSchema } from '@/lib/crm-schemas';
import Task from '@/models/Task';
import Activity from '@/models/Activity';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const task = await Task.findById(id).lean();
    if (!task) return err('Task not found', 404);
    if (user.role === 'client' && task.clientId.toString() !== user.id) {
      return err('Forbidden', 403);
    }
    return ok({ item: task });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const updates = taskUpdateSchema.parse(await request.json());
    const task = await Task.findById(id);
    if (!task) return err('Task not found', 404);
    if (user.role === 'client' && task.clientId.toString() !== user.id) {
      return err('Forbidden', 403);
    }

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.status !== undefined) {
      task.status = updates.status;
      task.completedAt = updates.status === 'completed' ? new Date() : undefined;
    }
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.dueDate !== undefined) task.dueDate = new Date(updates.dueDate);
    if (updates.projectId !== undefined) task.projectId = new Types.ObjectId(updates.projectId);
    if (updates.clientId !== undefined) task.clientId = new Types.ObjectId(updates.clientId);
    if (updates.assignedTo !== undefined) {
      task.assignedTo = updates.assignedTo ? new Types.ObjectId(updates.assignedTo) : undefined;
    }
    await task.save();

    await Activity.create({
      userId: new Types.ObjectId(user.id),
      action: 'TASK_UPDATED',
      description: `Task ${task.title} updated`,
      entityType: 'Task',
      entityId: task._id,
      timestamp: new Date(),
    });

    return ok({ item: task });
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
    const task = await Task.findByIdAndDelete(id);
    if (!task) return err('Task not found', 404);

    await Activity.create({
      userId: new Types.ObjectId(admin.id),
      action: 'TASK_DELETED',
      description: `Task ${task.title} deleted`,
      entityType: 'Task',
      entityId: task._id,
      timestamp: new Date(),
    });

    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
