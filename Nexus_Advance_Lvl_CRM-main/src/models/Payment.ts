import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface IPayment extends Document {
  clientId: Types.ObjectId;
  proposalId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  total: number;
  method?: PaymentMethod;
  status: PaymentStatus;
  dueDate: Date;
  paidAt?: Date;
  invoiceUrl?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    proposalId: { type: Schema.Types.ObjectId, ref: 'Proposal', required: true, index: true },
    milestoneId: { type: Schema.Types.ObjectId },
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['upi', 'card', 'netbanking', 'wallet'] },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'cancelled'],
      default: 'pending',
    },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    invoiceUrl: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
