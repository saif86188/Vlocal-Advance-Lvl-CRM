import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface ITask extends Document {
  title: string;
  description?: string;
  projectId: Types.ObjectId;
  clientId: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  dueDate?: Date;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const Task: Model<ITask> =
  (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>('Task', taskSchema);

export default Task;
