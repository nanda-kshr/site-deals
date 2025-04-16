import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  email: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);