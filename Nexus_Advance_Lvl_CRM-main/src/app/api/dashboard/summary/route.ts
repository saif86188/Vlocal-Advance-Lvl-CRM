import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/api-auth';
import { ok, handleApiError } from '@/lib/api-response';
import Client from '@/models/Client';
import Project from '@/models/Project';
import Task from '@/models/Task';
import Notification from '@/models/Notification';
import Activity from '@/models/Activity';
import User from '@/models/User';

export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();

    if (user.role === 'admin') {
      const [totalClients, totalProjects, activeProjects, completedProjects, pendingTasks, recentActivities, latestClients] =
        await Promise.all([
          Client.countDocuments(),
          Project.countDocuments(),
          Project.countDocuments({ status: 'in-progress' }),
          Project.countDocuments({ status: 'completed' }),
          Task.countDocuments({ status: { $ne: 'completed' } }),
          Activity.find().sort({ timestamp: -1 }).limit(8).lean(),
          User.find({ role: 'client' }).sort({ createdAt: -1 }).limit(5).select('name email company createdAt').lean(),
        ]);

      return ok({
        summary: { totalClients, totalProjects, activeProjects, completedProjects, pendingTasks },
        recentActivities,
        latestClients,
      });
    }

    const clientId = new Types.ObjectId(user.id);
    const [projects, pendingTasks, completedTasks, notifications, recentActivities] = await Promise.all([
      Project.find({ clientId }).sort({ createdAt: -1 }).lean(),
      Task.countDocuments({ clientId, status: { $ne: 'completed' } }),
      Task.countDocuments({ clientId, status: 'completed' }),
      Notification.find({ userId: clientId }).sort({ createdAt: -1 }).limit(10).lean(),
      Activity.find({ userId: clientId }).sort({ timestamp: -1 }).limit(8).lean(),
    ]);

    return ok({
      projects,
      pendingTasks,
      completedTasks,
      notifications,
      recentActivities,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
