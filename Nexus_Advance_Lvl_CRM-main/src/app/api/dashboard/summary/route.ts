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
import Campaign from '@/models/Campaign';
import Proposal from '@/models/Proposal';
import EscalationTicket from '@/models/EscalationTicket';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();

    if (user.role === 'admin') {
      const [
        totalClients,
        totalProjects,
        activeProjects,
        completedProjects,
        pendingTasks,
        recentActivities,
        latestClients,
        totalRevenueResult,
      ] = await Promise.all([
        Client.countDocuments(),
        Project.countDocuments(),
        Project.countDocuments({ status: 'in-progress' }),
        Project.countDocuments({ status: 'completed' }),
        Task.countDocuments({ status: { $ne: 'completed' } }),
        Activity.find().sort({ timestamp: -1 }).limit(8).lean(),
        User.find({ role: 'client' }).sort({ createdAt: -1 }).limit(5).select('name email company createdAt').lean(),
        Payment.aggregate([
          { $match: { status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

      const totalRevenue = totalRevenueResult[0]?.total ?? 0;

      // Group payments by month for chart
      const paymentsChart = await Payment.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } },
            amount: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Client growth by month
      const clientGrowthChart = await User.aggregate([
        { $match: { role: 'client' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return ok({
        summary: { totalClients, totalProjects, activeProjects, completedProjects, pendingTasks, totalRevenue },
        recentActivities,
        latestClients,
        charts: {
          revenue: paymentsChart.map((p) => ({ month: p._id, amount: p.amount })),
          clientGrowth: clientGrowthChart.map((c) => ({ month: c._id, count: c.count })),
        },
      });
    }

    // Client Dashboard Metrics
    const clientId = new Types.ObjectId(user.id);
    const clientProfile = await Client.findOne({ userId: clientId }).lean();

    const [
      projects,
      pendingTasks,
      completedTasks,
      notifications,
      recentActivities,
      campaignsCount,
      proposalsCount,
      openTicketsCount,
      campaigns,
      payments,
      tickets,
      taskList,
    ] = await Promise.all([
      Project.find({ clientId: user.id }).sort({ createdAt: -1 }).lean(),
      Task.countDocuments({ clientId: user.id, status: { $ne: 'completed' } }),
      Task.countDocuments({ clientId: user.id, status: 'completed' }),
      Notification.find({ userId: user.id }).sort({ createdAt: -1 }).limit(10).lean(),
      Activity.find({ userId: user.id }).sort({ timestamp: -1 }).limit(8).lean(),
      Campaign.countDocuments({ clientId: user.id }),
      Proposal.countDocuments({ clientId: user.id }),
      EscalationTicket.countDocuments({ clientId: user.id, status: 'open' }),
      Campaign.find({ clientId: user.id }).sort({ createdAt: -1 }).lean(),
      Payment.find({ clientId: user.id }).sort({ createdAt: -1 }).lean(),
      EscalationTicket.find({ clientId: user.id }).sort({ createdAt: -1 }).lean(),
      Task.find({ clientId: user.id, status: { $ne: 'completed' } }).limit(5).lean(),
    ]);

    return ok({
      clientProfile: {
        ...clientProfile,
        name: user.name,
        email: user.email,
        phone: clientProfile?.phone || user.phone,
      },
      projects,
      pendingTasks,
      completedTasks,
      notifications,
      recentActivities,
      stats: {
        campaigns: campaignsCount,
        proposals: proposalsCount,
        openTickets: openTicketsCount,
      },
      campaigns,
      payments,
      tickets,
      taskList,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
