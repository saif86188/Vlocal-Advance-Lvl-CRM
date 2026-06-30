import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { projectUpdateSchema } from '@/lib/crm-schemas';
import Project from '@/models/Project';
import Activity from '@/models/Activity';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const project = await Project.findById(id).lean();
    if (!project) return err('Project not found', 404);
    if (user.role === 'client' && project.clientId.toString() !== user.id) {
      return err('Forbidden', 403);
    }
    return ok({ item: project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    await connectDB();
    const { id } = await params;
    const updates = projectUpdateSchema.parse(await request.json());
    const project = await Project.findById(id);
    if (!project) return err('Project not found', 404);
    if (user.role === 'client' && project.clientId.toString() !== user.id) {
      return err('Forbidden', 403);
    }

    if (updates.title !== undefined) project.title = updates.title;
    if (updates.description !== undefined) project.description = updates.description;
    if (updates.status !== undefined) project.status = updates.status;
    if (updates.startDate !== undefined) project.startDate = new Date(updates.startDate);
    if (updates.dueDate !== undefined) project.dueDate = new Date(updates.dueDate);
    if (updates.progress !== undefined) {
      if (!project.phases.length) {
        project.phases = [{ name: 'Planning', progressPercent: 0, status: 'active' }];
      }
      project.phases[0].progressPercent = updates.progress;
      if (updates.progress >= 100) {
        project.status = 'completed';
      }
    }
    await project.save();

    await Activity.create({
      userId: new Types.ObjectId(user.id),
      action: 'PROJECT_UPDATED',
      description: `Project ${project.title} updated`,
      entityType: 'Project',
      entityId: project._id,
      timestamp: new Date(),
    });

    return ok({ item: project });
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
    const project = await Project.findByIdAndDelete(id);
    if (!project) return err('Project not found', 404);

    await Activity.create({
      userId: new Types.ObjectId(admin.id),
      action: 'PROJECT_DELETED',
      description: `Project ${project.title} deleted`,
      entityType: 'Project',
      entityId: project._id,
      timestamp: new Date(),
    });

    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
