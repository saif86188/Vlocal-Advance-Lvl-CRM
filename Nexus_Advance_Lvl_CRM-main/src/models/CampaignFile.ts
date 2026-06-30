import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type CampaignFileStatus = 'approved' | 'pending' | 'rejected';

export interface ICampaignFile extends Document {
  name: string;
  type: string;
  size: number;
  url: string;
  campaignId: Types.ObjectId;
  clientId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  uploadedByName: string;
  status: CampaignFileStatus;
  createdAt: Date;
  updatedAt: Date;
}

const campaignFileSchema = new Schema<ICampaignFile>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    url: { type: String, required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedByName: { type: String, required: true },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const CampaignFile: Model<ICampaignFile> =
  (mongoose.models.CampaignFile as Model<ICampaignFile>) ||
  mongoose.model<ICampaignFile>('CampaignFile', campaignFileSchema);

export default CampaignFile;
