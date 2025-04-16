import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message, { IMessage } from '@/models/Message';
import Ticket from '@/models/Ticket';
import mongoose from 'mongoose';

interface MessageRequest {
  ticketId: string;
  content: string;
}

interface MessageResponse {
  _id: string;
  ticketId: string;
  sender: string;
  content: string;
  timestamp: Date;
} 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');
    const email = searchParams.get('email');

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    await connectDB();
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.email !== email) {
      console.error('Ticket not found or unauthorized access:', { ticket, email });
      return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
    }

    const messages = await Message.find({ ticketId })
      .select('_id ticketId sender content timestamp')
      .lean<Array<IMessage & { _id: mongoose.Types.ObjectId; ticketId: mongoose.Types.ObjectId }>>()
      .then((docs) =>
        docs.map((doc) => ({
          _id: doc._id.toString(),
          ticketId: doc.ticketId.toString(),
          sender: doc.sender,
          content: doc.content,
          timestamp: doc.timestamp,
        }))
      ) as MessageResponse[];

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: MessageRequest = await request.json();
    const { ticketId, content } = body;

    if (!ticketId || !content) {
      return NextResponse.json({ error: 'Ticket ID and content are required' }, { status: 400 });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
    }

    const message = new Message({
      ticketId,
      sender: 'user',
      content,
    });

    await message.save();

    // Update ticket status to in-progress if it's open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
      await ticket.save();
    }

    return NextResponse.json({ messageId: message._id }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
