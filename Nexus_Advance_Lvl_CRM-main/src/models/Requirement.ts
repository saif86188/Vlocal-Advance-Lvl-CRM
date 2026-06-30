import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type RequirementPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequirementStatus =
  | 'draft'
  | 'awaiting_review'
  | 'reviewed'
  | 'proposal_sent'
  | 'closed';

export interface IFileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface IRequirement extends Document {
  clientId: Types.ObjectId;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
  priority: RequirementPriority;
  files: IFileAttachment[];
  status: RequirementStatus;
  submittedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

const fileAttachmentSchema = new Schema<IFileAttachment>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const requirementSchema = new Schema<IRequirement>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budgetMin: { type: Number, required: true, min: 0 },
    budgetMax: { type: Number, required: true, min: 0 },
    deadline: { type: Date, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    files: { type: [fileAttachmentSchema], default: [] },
    status: {
      type: String,
      enum: ['draft', 'awaiting_review', 'reviewed', 'proposal_sent', 'closed'],
      default: 'draft',
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Requirement: Model<IRequirement> =
  (mongoose.models.Requirement as Model<IRequirement>) ||
  mongoose.model<IRequirement>('Requirement', requirementSchema);

export default Requirement;
