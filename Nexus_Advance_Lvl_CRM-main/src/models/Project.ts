import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold';

export interface IProjectPhase {
  name: string;
  progressPercent: number;
  status: 'pending' | 'active' | 'done';
}

export interface IChecklistItem {
  label: string;
  completedAt?: Date;
  completedBy?: string;
}

export interface IDeliverable {
  label: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface IProjectTeamAssignment {
  userId: Types.ObjectId;
  role: 'lead' | 'designer' | 'developer' | 'qa';
}

export interface IProject extends Document {
  title: string;
  description?: string;
  proposalId: Types.ObjectId;
  clientId: Types.ObjectId;
  status: ProjectStatus;
  phases: IProjectPhase[];
  currentPhaseIndex: number;
  milestoneChecklist: IChecklistItem[];
  deliverables: IDeliverable[];
  assignedTeam: IProjectTeamAssignment[];
  startDate: Date;
  dueDate: Date;
  actualEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectPhaseSchema = new Schema<IProjectPhase>(
  {
    name: { type: String, required: true },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ['pending', 'active', 'done'], default: 'pending' },
  },
  { _id: false }
);

const checklistItemSchema = new Schema<IChecklistItem>(
  {
    label: { type: String, required: true },
    completedAt: { type: Date },
    completedBy: { type: String },
  },
  { _id: true }
);

const deliverableSchema = new Schema<IDeliverable>(
  {
    label: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: String, required: true },
  },
  { _id: true }
);

const projectTeamSchema = new Schema<IProjectTeamAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['lead', 'designer', 'developer', 'qa'], required: true },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    proposalId: { type: Schema.Types.ObjectId, ref: 'Proposal', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'on-hold'],
      default: 'in-progress',
    },
    phases: { type: [projectPhaseSchema], default: [] },
    currentPhaseIndex: { type: Number, default: 0, min: 0 },
    milestoneChecklist: { type: [checklistItemSchema], default: [] },
    deliverables: { type: [deliverableSchema], default: [] },
    assignedTeam: { type: [projectTeamSchema], default: [] },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    actualEnd: { type: Date },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>('Project', projectSchema);

export default Project;
