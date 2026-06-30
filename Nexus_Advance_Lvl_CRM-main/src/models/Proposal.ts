import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'awaiting_approval'
  | 'under_discussion'
  | 'approved'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'archived';

export interface IPhase {
  name: string;
  description: string;
  durationDays: number;
  order: number;
}

export interface IMilestone {
  name: string;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface ITeamAssignment {
  userId: Types.ObjectId;
  role: 'lead' | 'designer' | 'developer' | 'qa';
}

export interface IProposal extends Document {
  requirementId: Types.ObjectId;
  clientId: Types.ObjectId;
  version: number;
  scope: string[];
  phases: IPhase[];
  deliverables: string[];
  milestones: IMilestone[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalCost: number;
  assumptions: string;
  exclusions: string;
  supportDuration: string;
  status: ProposalStatus;
  sentAt?: Date;
  approvedAt?: Date;
  archivedAt?: Date;
  teamMembers: ITeamAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

const phaseSchema = new Schema<IPhase>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    durationDays: { type: Number, required: true, min: 0 },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const milestoneSchema = new Schema<IMilestone>(
  {
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  },
  { _id: true }
);

const teamAssignmentSchema = new Schema<ITeamAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['lead', 'designer', 'developer', 'qa'], required: true },
  },
  { _id: false }
);

const proposalSchema = new Schema<IProposal>(
  {
    requirementId: { type: Schema.Types.ObjectId, ref: 'Requirement', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    scope: { type: [String], default: [] },
    phases: { type: [phaseSchema], default: [] },
    deliverables: { type: [String], default: [] },
    milestones: { type: [milestoneSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    taxPercent: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, required: true, min: 0 },
    assumptions: { type: String, default: '' },
    exclusions: { type: String, default: '' },
    supportDuration: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'draft',
        'sent',
        'awaiting_approval',
        'under_discussion',
        'approved',
        'rejected',
        'in_progress',
        'completed',
        'archived',
      ],
      default: 'draft',
    },
    sentAt: { type: Date },
    approvedAt: { type: Date },
    archivedAt: { type: Date },
    teamMembers: { type: [teamAssignmentSchema], default: [] },
  },
  { timestamps: true }
);

const Proposal: Model<IProposal> =
  (mongoose.models.Proposal as Model<IProposal>) ||
  mongoose.model<IProposal>('Proposal', proposalSchema);

export default Proposal;
