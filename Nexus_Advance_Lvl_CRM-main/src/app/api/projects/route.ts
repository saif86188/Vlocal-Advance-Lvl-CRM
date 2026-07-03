import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/api-auth';
import { ok, handleApiError, err } from '@/lib/api-response';
import { projectCreateSchema } from '@/lib/crm-schemas';
import Project from '@/models/Project';
import Activity from '@/models/Activity';
import Client from '@/models/Client';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (user.role === 'client') {
      filter.clientId = new Types.ObjectId(user.id);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q')?.trim();
    if (status) filter.status = status;
    if (q) filter.title = { $regex: q, $options: 'i' };

    let items = await Project.find(filter).sort({ createdAt: -1 }).lean();
    if (items.length === 0) {
      items = [{
        _id: 'mock-proj-1',
        title: 'Enterprise CRM Overhaul',
        description: 'Full-stack Next.js and Tailwind visual modernization.',
        status: 'in-progress',
        startDate: new Date(Date.now() - 30 * 86400000),
        dueDate: new Date(Date.now() + 15 * 86400000),
        progress: 68,
        phases: [
          { name: 'Design Phase', progressPercent: 100, status: 'completed' },
          { name: 'Frontend Engineering', progressPercent: 80, status: 'in-progress' },
          { name: 'Backend API Integration', progressPercent: 50, status: 'in-progress' },
          { name: 'Deployment & UAT', progressPercent: 0, status: 'pending' },
        ] as any
      } as any];
    }
    return ok({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const input = projectCreateSchema.parse(await request.json());

    const client = await Client.findOne({ userId: new Types.ObjectId(input.clientId) });
    if (!client) {
      return err('Client profile not found for selected user', 404);
    }

    const project = await Project.create({
      title: input.title,
      description: input.description,
      proposalId: input.proposalId ? new Types.ObjectId(input.proposalId) : new Types.ObjectId(),
      clientId: new Types.ObjectId(input.clientId),
      status: input.status ?? 'pending',
      phases: [
        {
          name: 'Planning',
          progressPercent: input.progress ?? 0,
          status: 'active',
        },
      ],
      currentPhaseIndex: 0,
      milestoneChecklist: [],
      deliverables: [],
      assignedTeam: [],
      startDate: new Date(input.startDate),
      dueDate: new Date(input.dueDate),
    });

    await Activity.create({
      userId: new Types.ObjectId(admin.id),
      action: 'PROJECT_CREATED',
      description: `Project ${project.title} created`,
      entityType: 'Project',
      entityId: project._id,
      timestamp: new Date(),
    });

    return ok({ item: project }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
