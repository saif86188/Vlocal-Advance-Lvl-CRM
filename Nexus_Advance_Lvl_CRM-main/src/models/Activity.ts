import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IActivity extends Document {
  userId: Types.ObjectId;
  action: string;
  description: string;
  entityType?: string;
  entityId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    entityType: { type: String, trim: true },
    entityId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

const Activity: Model<IActivity> =
  (mongoose.models.Activity as Model<IActivity>) ||
  mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
