import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IClient extends Document {
  userId: Types.ObjectId;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  industry?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    industry: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Client: Model<IClient> =
  (mongoose.models.Client as Model<IClient>) || mongoose.model<IClient>('Client', clientSchema);

export default Client;
