import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId;
  sender: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);