import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type CampaignStatus = 'planning' | 'active' | 'completed' | 'on-hold';

export interface ICampaignTeamMember {
  userId?: Types.ObjectId;
  name: string;
  role: string;
  avatar?: string;
}

export interface ICampaignTimelinePhase {
  phase: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  dateRange: string;
}

export interface ICampaignApproval {
  item: string;
  status: 'approved' | 'pending' | 'in-review' | 'rejected';
  date?: Date;
}

export interface ICampaignTasks {
  total: number;
  completed: number;
  pending: number;
  delayed: number;
}

export interface ICampaign extends Document {
  name: string;
  clientId: Types.ObjectId;
  type: string;
  status: CampaignStatus;
  progress: number;
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  teamSize: number;
  assignedTeam: ICampaignTeamMember[];
  tasks: ICampaignTasks;
  timeline: ICampaignTimelinePhase[];
  approvals: ICampaignApproval[];
  createdAt: Date;
  updatedAt: Date;
}

const campaignTeamSchema = new Schema<ICampaignTeamMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const timelinePhaseSchema = new Schema<ICampaignTimelinePhase>(
  {
    phase: { type: String, required: true },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'pending', 'delayed'],
      default: 'pending',
    },
    dateRange: { type: String, required: true },
  },
  { _id: false }
);

const approvalSchema = new Schema<ICampaignApproval>(
  {
    item: { type: String, required: true },
    status: {
      type: String,
      enum: ['approved', 'pending', 'in-review', 'rejected'],
      default: 'pending',
    },
    date: { type: Date },
  },
  { _id: true }
);

const campaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true, trim: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'on-hold'],
      default: 'planning',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    budget: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teamSize: { type: Number, default: 0, min: 0 },
    assignedTeam: { type: [campaignTeamSchema], default: [] },
    tasks: {
      total: { type: Number, default: 0, min: 0 },
      completed: { type: Number, default: 0, min: 0 },
      pending: { type: Number, default: 0, min: 0 },
      delayed: { type: Number, default: 0, min: 0 },
    },
    timeline: { type: [timelinePhaseSchema], default: [] },
    approvals: { type: [approvalSchema], default: [] },
  },
  { timestamps: true }
);

const Campaign: Model<ICampaign> =
  (mongoose.models.Campaign as Model<ICampaign>) ||
  mongoose.model<ICampaign>('Campaign', campaignSchema);

export default Campaign;
