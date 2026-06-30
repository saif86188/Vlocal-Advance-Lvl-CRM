import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type UserRole = 'admin' | 'client';

export interface IMessage {
  senderId: Types.ObjectId;
  senderRole: UserRole;
  content: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  timestamp: Date;
}

export interface IDiscussion extends Document {
  proposalId: Types.ObjectId;
  clientId: Types.ObjectId;
  messages: IMessage[];
  revisionRequested: boolean;
  unreads: number;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['admin', 'client'], required: true },
    content: { type: String, required: true },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const discussionSchema = new Schema<IDiscussion>(
  {
    proposalId: { type: Schema.Types.ObjectId, ref: 'Proposal', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messages: { type: [messageSchema], default: [] },
    revisionRequested: { type: Boolean, default: false },
    unreads: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const Discussion: Model<IDiscussion> =
  (mongoose.models.Discussion as Model<IDiscussion>) ||
  mongoose.model<IDiscussion>('Discussion', discussionSchema);

export default Discussion;
