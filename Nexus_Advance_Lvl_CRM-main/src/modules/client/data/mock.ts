import {
  User,
  Requirement,
  Proposal,
  Project,
  Payment,
  EscalationTicket,
  Discussion
} from './models';

export const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'saif',
    email: 'saif@vlocal.com',
    role: 'client',
    companyName: 'Vlocal Corp',
    createdAt: '2024-01-15T10:00:00Z',
    avatarUrl: 'https://avatar.iran.liara.run/public/boy?username=saif'
  },
  {
    id: 'u-2',
    name: 'saif',
    email: 'saif@vlocal.com',
    role: 'client',
    companyName: 'Vlocal Technologies',
    createdAt: '2024-02-20T11:00:00Z',
    avatarUrl: 'https://avatar.iran.liara.run/public/boy?username=saif'
  },
  {
    id: 'a-1',
    name: 'Admin Team',
    email: 'hello@vlocal.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  }
];

export const mockRequirements: Requirement[] = [
  {
    id: 'req-1',
    clientId: 'u-1',
    title: 'Brand Identity + Website',
    description: 'We need a complete rebrand including a new logo, typography system, and a marketing website built on React.',
    budgetMin: 100000,
    budgetMax: 150000,
    deadline: '2025-08-01T00:00:00Z',
    priority: 'high',
    files: [
      { id: 'f-1', name: 'current-brand-assets.zip', url: '#', type: 'application/zip', size: 1024 * 1024 * 5 }
    ],
    status: 'proposal_sent',
    submittedAt: '2025-05-01T09:00:00Z',
    updatedAt: '2025-05-02T10:00:00Z'
  },
  {
    id: 'req-2',
    clientId: 'u-1',
    title: 'Mobile App MVP',
    description: 'Looking to build a cross-platform mobile app for our new product line.',
    budgetMin: 200000,
    budgetMax: 300000,
    deadline: '2025-10-15T00:00:00Z',
    priority: 'medium',
    files: [],
    status: 'draft',
    submittedAt: '2025-05-10T14:30:00Z',
    updatedAt: '2025-05-10T14:30:00Z'
  },
  {
    id: 'req-3',
    clientId: 'u-2',
    title: 'SEO Audit and Optimization',
    description: 'Our organic traffic dropped. Need a full technical SEO audit.',
    budgetMin: 30000,
    budgetMax: 50000,
    deadline: '2025-06-01T00:00:00Z',
    priority: 'urgent',
    files: [],
    status: 'awaiting_review',
    submittedAt: '2025-05-12T08:15:00Z',
    updatedAt: '2025-05-12T08:15:00Z'
  }
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop-1-v1',
    requirementId: 'req-1',
    clientId: 'u-1',
    version: 1,
    scope: ['UI Design', 'Development', 'Branding'],
    phases: [
      { id: 'p1', name: 'Discovery', description: 'Initial research', durationDays: 7, order: 1 },
      { id: 'p2', name: 'Design', description: 'Figma prototypes', durationDays: 14, order: 2 },
      { id: 'p3', name: 'Development', description: 'React implementation', durationDays: 21, order: 3 }
    ],
    deliverables: ['Figma source files', 'Source code repo'],
    milestones: [
      { id: 'm1', name: 'Kickoff', dueDate: '2025-05-10', amount: 25000, status: 'paid' },
      { id: 'm2', name: 'Design Delivery', dueDate: '2025-05-24', amount: 40000, status: 'pending' },
      { id: 'm3', name: 'Development', dueDate: '2025-06-15', amount: 35000, status: 'pending' }
    ],
    subtotal: 100000,
    taxPercent: 18,
    taxAmount: 18000,
    totalCost: 118000,
    assumptions: 'Client provides copy.',
    exclusions: 'Hosting costs.',
    supportDuration: '30 days',
    status: 'archived' as any,
    sentAt: '2025-05-02T10:00:00Z',
    archivedAt: '2025-05-03T15:00:00Z',
    teamMembers: []
  },
  {
    id: 'prop-1-v2',
    requirementId: 'req-1',
    clientId: 'u-1',
    version: 2,
    scope: ['UI Design', 'Development', 'SEO', 'Branding'],
    phases: [
      { id: 'p1', name: 'Discovery', description: 'Initial research', durationDays: 7, order: 1 },
      { id: 'p2', name: 'Design', description: 'Figma prototypes', durationDays: 14, order: 2 },
      { id: 'p3', name: 'Development', description: 'React implementation', durationDays: 21, order: 3 },
      { id: 'p4', name: 'QA', description: 'Testing', durationDays: 5, order: 4 },
      { id: 'p5', name: 'Launch', description: 'Deployment', durationDays: 2, order: 5 }
    ],
    deliverables: ['Figma source files', 'Source code repo', 'SEO audit report', 'Production deployment'],
    milestones: [
      { id: 'm1', name: 'Kickoff', dueDate: '2025-05-10', amount: 25000, status: 'paid' },
      { id: 'm2', name: 'Design Delivery', dueDate: '2025-05-24', amount: 40000, status: 'pending' },
      { id: 'm3', name: 'Development', dueDate: '2025-06-15', amount: 45000, status: 'pending' },
      { id: 'm4', name: 'Final Launch', dueDate: '2025-06-25', amount: 15000, status: 'pending' }
    ],
    subtotal: 125000,
    taxPercent: 18,
    taxAmount: 22500,
    totalCost: 147500,
    assumptions: 'Client provides copy. 3 revision rounds included.',
    exclusions: 'Hosting excluded.',
    supportDuration: '30 days post-launch',
    status: 'awaiting_approval',
    sentAt: '2025-05-03T16:00:00Z',
    teamMembers: [
      { userId: 't-1', role: 'lead' }
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    proposalId: 'prop-1-v2',
    clientId: 'u-1',
    phases: [
      { name: 'Discovery', progressPercent: 100, status: 'done' },
      { name: 'Design', progressPercent: 60, status: 'active' },
      { name: 'Development', progressPercent: 0, status: 'pending' },
      { name: 'QA', progressPercent: 0, status: 'pending' },
      { name: 'Launch', progressPercent: 0, status: 'pending' }
    ],
    currentPhaseIndex: 1,
    milestoneChecklist: [
      { id: 'c1', label: 'Kickoff meeting', completedAt: '2025-05-11T10:00:00Z' },
      { id: 'c2', label: 'Brand mood board approved', completedAt: '2025-05-15T14:00:00Z' },
      { id: 'c3', label: 'Logo + design system delivery' },
      { id: 'c4', label: 'Homepage prototype' },
      { id: 'c5', label: 'Full development handoff' }
    ],
    deliverables: [
      { id: 'd1', label: 'brand-moodboard.pdf', fileUrl: '#', uploadedAt: '2025-05-13T09:00:00Z', uploadedBy: 'Admin' },
      { id: 'd2', label: 'logo-drafts-v2.fig', fileUrl: '#', uploadedAt: '2025-05-16T11:00:00Z', uploadedBy: 'Admin' }
    ],
    teamMembers: [],
    startDate: '2025-05-10T00:00:00Z',
    estimatedEnd: '2025-06-25T00:00:00Z'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    clientId: 'u-1',
    proposalId: 'prop-1-v2',
    milestoneId: 'm1',
    invoiceNumber: 'INV-001',
    amount: 25000,
    taxAmount: 4500,
    total: 29500,
    status: 'paid',
    dueDate: '2025-05-10T00:00:00Z',
    paidAt: '2025-05-09T14:20:00Z',
    invoiceUrl: '#',
    receiptUrl: '#'
  },
  {
    id: 'pay-2',
    clientId: 'u-1',
    proposalId: 'prop-1-v2',
    milestoneId: 'm2',
    invoiceNumber: 'INV-002',
    amount: 40000,
    taxAmount: 7200,
    total: 47200,
    status: 'pending',
    dueDate: '2025-05-24T00:00:00Z',
    invoiceUrl: '#'
  },
  {
    id: 'pay-3',
    clientId: 'u-1',
    proposalId: 'prop-1-v2',
    milestoneId: 'm3',
    invoiceNumber: 'INV-003',
    amount: 45000,
    taxAmount: 8100,
    total: 53100,
    status: 'pending',
    dueDate: '2025-06-15T00:00:00Z',
    invoiceUrl: '#'
  }
];

export const mockDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    proposalId: 'prop-1-v2',
    clientId: 'u-1',
    revisionRequested: false,
    unreads: 1,
    messages: [
      { id: 'm1', senderId: 'a-1', senderRole: 'admin', content: 'Here is the revised proposal with SEO added.', timestamp: '2025-05-03T16:05:00Z' },
      { id: 'm2', senderId: 'u-1', senderRole: 'client', content: 'Looks much better! I will review the timeline with my team.', timestamp: '2025-05-04T09:20:00Z' }
    ]
  }
];

export const mockTickets: EscalationTicket[] = [
  {
    id: 'tic-1',
    clientId: 'u-1',
    subject: 'Access to Figma file denied',
    description: 'I tried opening the logo drafts but it says I need permission.',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2025-05-16T12:00:00Z',
    thread: [
      { id: 't1', senderId: 'u-1', senderRole: 'client', content: 'I tried opening the logo drafts but it says I need permission.', timestamp: '2025-05-16T12:00:00Z' },
      { id: 't2', senderId: 'a-1', senderRole: 'admin', content: 'Sorry about that! I have updated the share settings. Try now.', timestamp: '2025-05-16T12:15:00Z' }
    ]
  }
];
