import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'client';

export type TeamRole = 'lead' | 'designer' | 'developer' | 'qa';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  phone?: string;
  avatarUrl?: string;
  teamRole?: TeamRole;
  activeProjects?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'client'], required: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    teamRole: { type: String, enum: ['lead', 'designer', 'developer', 'qa'] },
    activeProjects: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', userSchema);

export default User;
