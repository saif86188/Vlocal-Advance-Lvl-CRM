import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export type UserRole = 'admin' | 'client';

export interface ITicketMessage {
  senderId: Types.ObjectId;
  senderRole: UserRole;
  content: string;
  timestamp: Date;
}

export interface IEscalationTicket extends Document {
  clientId: Types.ObjectId;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  thread: ITicketMessage[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const ticketMessageSchema = new Schema<ITicketMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['admin', 'client'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const escalationTicketSchema = new Schema<IEscalationTicket>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    thread: { type: [ticketMessageSchema], default: [] },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const EscalationTicket: Model<IEscalationTicket> =
  (mongoose.models.EscalationTicket as Model<IEscalationTicket>) ||
  mongoose.model<IEscalationTicket>('EscalationTicket', escalationTicketSchema);

export default EscalationTicket;
