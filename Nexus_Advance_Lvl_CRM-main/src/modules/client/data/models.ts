export type Role = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export type RequirementPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RequirementStatus = 'draft' | 'awaiting_review' | 'reviewed' | 'proposal_sent' | 'closed';

export interface Requirement {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  priority: RequirementPriority;
  files: FileAttachment[];
  status: RequirementStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  order: number;
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface TeamAssignment {
  userId: string;
  role: 'lead' | 'designer' | 'developer' | 'qa';
}

export type ProposalStatus = 'draft' | 'sent' | 'awaiting_approval' | 'under_discussion' | 'approved' | 'rejected' | 'in_progress' | 'completed';

export interface Proposal {
  id: string;
  requirementId: string;
  clientId: string;
  version: number;
  scope: string[];
  phases: Phase[];
  deliverables: string[];
  milestones: Milestone[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalCost: number;
  assumptions: string;
  exclusions: string;
  supportDuration: string;
  status: ProposalStatus;
  sentAt: string;
  approvedAt?: string;
  archivedAt?: string;
  teamMembers: TeamAssignment[];
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: Role;
  content: string;
  attachments?: FileAttachment[];
  timestamp: string;
}

export interface Discussion {
  id: string;
  proposalId: string;
  clientId: string;
  messages: Message[];
  revisionRequested: boolean;
  unreads: number;
}

export interface Payment {
  id: string;
  clientId: string;
  proposalId: string;
  milestoneId: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  total: number;
  method?: 'upi' | 'card' | 'netbanking' | 'wallet';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  invoiceUrl: string;
  receiptUrl?: string;
}

export interface ProjectPhase {
  name: string;
  progressPercent: number;
  status: 'pending' | 'active' | 'done';
}

export interface ChecklistItem {
  id: string;
  label: string;
  completedAt?: string;
  completedBy?: string;
}

export interface Deliverable {
  id: string;
  label: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Project {
  id: string;
  proposalId: string;
  clientId: string;
  phases: ProjectPhase[];
  currentPhaseIndex: number;
  milestoneChecklist: ChecklistItem[];
  deliverables: Deliverable[];
  teamMembers: TeamAssignment[];
  startDate: string;
  estimatedEnd: string;
  actualEnd?: string;
}

export interface EscalationTicket {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  attachments?: FileAttachment[];
  thread: Message[];
  createdAt: string;
  resolvedAt?: string;
}
