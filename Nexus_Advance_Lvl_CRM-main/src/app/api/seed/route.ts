import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import {
  User,
  Client,
  Project,
  Task,
  Campaign,
  Payment,
  EscalationTicket,
  Activity,
  Notification,
  Proposal
} from '@/models';
import { Types } from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Client.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Campaign.deleteMany({}),
      Payment.deleteMany({}),
      EscalationTicket.deleteMany({}),
      Activity.deleteMany({}),
      Notification.deleteMany({}),
      Proposal.deleteMany({}),
    ]);

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@vlocal.com',
      password: 'password123',
      role: 'admin',
      company: 'Vlocal Core',
      phone: '+1 (555) 111-2222',
      avatarUrl: 'https://avatar.iran.liara.run/public/boy?username=admin',
    });

    const clientUser = await User.create({
      name: 'Saif Client',
      email: 'saif@vlocal.com',
      password: 'password123',
      role: 'client',
      company: 'Nexus Industries',
      phone: '+1 (555) 999-8888',
      avatarUrl: 'https://avatar.iran.liara.run/public/boy?username=saif',
    });

    // 2. Create Client Profile
    const clientProfile = await Client.create({
      userId: clientUser._id,
      companyName: 'Nexus Industries',
      contactName: 'Saif Client',
      email: 'saif@vlocal.com',
      phone: '+1 (555) 999-8888',
      industry: 'Technology',
      notes: 'Premium enterprise client. Demands clean UI, Recharts dashboards, and Kanban views.',
      status: 'active',
    });

    // 3. Create Proposals
    const proposal = await Proposal.create({
      title: 'Marketing Campaign Proposal v2',
      clientId: clientUser._id,
      description: 'Q2/Q3 Growth strategy and expansion proposal.',
      budget: 150000,
      status: 'approved',
      approvedAt: new Date(Date.now() - 5 * 86400000),
      phases: [
        { name: 'Research & Strategy', progressPercent: 100 },
        { name: 'Content Strategy', progressPercent: 80 },
        { name: 'Launch & Analytics', progressPercent: 20 },
      ],
    });

    // 4. Create Projects
    const project = await Project.create({
      title: 'Enterprise CRM Overhaul',
      description: 'Full-stack Next.js and Tailwind visual modernization.',
      clientId: clientUser._id,
      proposalId: proposal._id,
      status: 'in-progress',
      startDate: new Date(Date.now() - 30 * 86400000),
      dueDate: new Date(Date.now() + 15 * 86400000),
      progress: 68,
      phases: [
        { phase: 'Design Phase', progressPercent: 100, status: 'completed', dateRange: 'May 1 - May 15' },
        { phase: 'Frontend Engineering', progressPercent: 80, status: 'in-progress', dateRange: 'May 16 - Jun 15' },
        { phase: 'Backend API Integration', progressPercent: 50, status: 'in-progress', dateRange: 'Jun 16 - Jul 10' },
        { phase: 'Deployment & UAT', progressPercent: 0, status: 'pending', dateRange: 'Jul 11 - Jul 25' },
      ],
    });

    // 5. Create Campaigns
    await Campaign.create({
      name: 'Brand Awareness Expansion',
      clientId: clientUser._id,
      type: 'Social Media',
      status: 'active',
      progress: 45,
      budget: 75000,
      spent: 33750,
      startDate: new Date(Date.now() - 15 * 86400000),
      endDate: new Date(Date.now() + 45 * 86400000),
      teamSize: 4,
      tasks: {
        total: 10,
        completed: 4,
        pending: 5,
        delayed: 1,
      },
      timeline: [
        { phase: 'Asset Creation', status: 'completed', dateRange: 'Jun 1 - Jun 15' },
        { phase: 'Ad Launch', status: 'in-progress', dateRange: 'Jun 16 - Jul 1' },
        { phase: 'Lead Capture', status: 'pending', dateRange: 'Jul 2 - Jul 20' },
      ],
    });

    await Campaign.create({
      name: 'Q3 Product Launch Promo',
      clientId: clientUser._id,
      type: 'Influencer Outreach',
      status: 'planning',
      progress: 15,
      budget: 95000,
      spent: 12000,
      startDate: new Date(Date.now() - 2 * 86400000),
      endDate: new Date(Date.now() + 60 * 86400000),
      teamSize: 3,
      tasks: {
        total: 15,
        completed: 2,
        pending: 13,
        delayed: 0,
      },
      timeline: [
        { phase: 'Negotiation', status: 'in-progress', dateRange: 'Jul 1 - Jul 15' },
        { phase: 'Review Videos', status: 'pending', dateRange: 'Jul 16 - Aug 10' },
      ],
    });

    // 6. Create Tasks
    await Task.create({
      title: 'Implement Recharts Analytics on Admin Page',
      description: 'Create interactive line, bar and pie charts fetching live MongoDB stats.',
      projectId: project._id,
      clientId: clientUser._id,
      assignedTo: adminUser._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 86400000),
    });

    await Task.create({
      title: 'Fix Authentication Cookie Issues on Vercel',
      description: 'Ensure cookie domain, sameSite settings are Vercel-serverless safe.',
      projectId: project._id,
      clientId: clientUser._id,
      assignedTo: adminUser._id,
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() - 1 * 86400000), // Overdue
    });

    await Task.create({
      title: 'Design Details Drawer for Client List',
      description: 'Make table rows clickable. Build Drawer with client info sheet.',
      projectId: project._id,
      clientId: clientUser._id,
      assignedTo: adminUser._id,
      status: 'completed',
      priority: 'medium',
      dueDate: new Date(Date.now() - 3 * 86400000),
      completedAt: new Date(Date.now() - 3 * 86400000),
    });

    await Task.create({
      title: 'Draft Project Agreement Proposal',
      description: 'Lay out milestones, terms, and resources.',
      projectId: project._id,
      clientId: clientUser._id,
      assignedTo: clientUser._id,
      status: 'completed',
      priority: 'low',
      dueDate: new Date(Date.now() - 10 * 86400000),
      completedAt: new Date(Date.now() - 11 * 86400000),
    });

    // 7. Create Payments (Invoices)
    await Payment.create({
      clientId: clientUser._id,
      projectId: project._id,
      amount: 25000,
      currency: 'INR',
      status: 'paid',
      dueDate: new Date(Date.now() - 15 * 86400000),
      paidAt: new Date(Date.now() - 14 * 86400000),
      description: 'Milestone 1 Payment - Strategy and Wireframes',
    });

    await Payment.create({
      clientId: clientUser._id,
      projectId: project._id,
      amount: 45000,
      currency: 'INR',
      status: 'pending',
      dueDate: new Date(Date.now() + 5 * 86400000),
      description: 'Milestone 2 Payment - Design and UI Components Prototype',
    });

    await Payment.create({
      clientId: clientUser._id,
      projectId: project._id,
      amount: 15000,
      currency: 'INR',
      status: 'overdue',
      dueDate: new Date(Date.now() - 3 * 86400000),
      description: 'Milestone 3 Payment - API Integration Contract',
    });

    // 8. Create Escalation Tickets
    await EscalationTicket.create({
      clientId: clientUser._id,
      projectId: project._id,
      subject: 'Delay in CRM Prototype Design delivery',
      description: 'Need feedback on why the custom widgets look simple. Request modernizing.',
      priority: 'high',
      status: 'open',
      thread: [
        {
          senderId: clientUser._id,
          senderRole: 'client',
          content: 'Hi Team, the design is a bit basic. Please upgrade using glassmorphism and modern colors.',
          timestamp: new Date(Date.now() - 2 * 86400000),
        },
      ],
    });

    await EscalationTicket.create({
      clientId: clientUser._id,
      projectId: project._id,
      subject: 'Broken API redirect loop',
      description: 'When session expires, page reloads endlessly.',
      priority: 'critical',
      status: 'resolved',
      thread: [
        {
          senderId: clientUser._id,
          senderRole: 'client',
          content: 'I get redirected in loops on login.',
          timestamp: new Date(Date.now() - 5 * 86400000),
        },
        {
          senderId: adminUser._id,
          senderRole: 'admin',
          content: 'Resolved this in middleware.ts by clearing cookies on expiry and checking active roles.',
          timestamp: new Date(Date.now() - 4 * 86400000),
        },
      ],
    });

    // 9. Create Activities
    await Activity.create({
      userId: adminUser._id,
      action: 'PROJECT_CREATED',
      description: `Project ${project.title} created by Admin`,
      entityType: 'Project',
      entityId: project._id,
      timestamp: new Date(Date.now() - 30 * 86400000),
    });

    await Activity.create({
      userId: clientUser._id,
      action: 'PROPOSAL_APPROVED',
      description: `Proposal ${proposal.title} approved by Saif Client`,
      entityType: 'Proposal',
      entityId: proposal._id,
      timestamp: new Date(Date.now() - 5 * 86400000),
    });

    await Activity.create({
      userId: adminUser._id,
      action: 'TASK_COMPLETED',
      description: 'Admin completed task: Design Details Drawer for Client List',
      entityType: 'Task',
      entityId: project._id,
      timestamp: new Date(Date.now() - 3 * 86400000),
    });

    // 10. Create Notifications
    await Notification.create({
      userId: clientUser._id,
      title: 'Milestone 1 Confirmed',
      message: 'Admin User marked Milestone 1 Design Phase as complete.',
      type: 'success',
      read: false,
    });

    await Notification.create({
      userId: clientUser._id,
      title: 'Invoice Due',
      message: 'Invoice of ₹45,000 is due on Jul 8, 2026.',
      type: 'warning',
      read: false,
    });

    await Notification.create({
      userId: adminUser._id,
      title: 'New Escalation Support Ticket',
      message: 'Saif Client submitted a support ticket regarding "Delay in CRM Prototype Design delivery".',
      type: 'error',
      read: false,
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Database seeded successfully with 2 Users, 1 Client Profile, 2 Campaigns, 1 Project, 4 Tasks, 3 Payments, 2 Support Tickets, and relative logs.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error.message || 'Seeding failed',
      },
      { status: 500 }
    );
  }
}
