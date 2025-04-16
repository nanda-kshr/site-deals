import mongoose, { Schema, Document } from 'mongoose';

export interface IMailVerification extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MailVerificationSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

MailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.MailVerification || mongoose.model<IMailVerification>('MailVerification', MailVerificationSchema);