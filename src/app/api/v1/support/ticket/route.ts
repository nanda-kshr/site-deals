import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Ticket, { ITicket } from '@/models/Ticket';
import mongoose from 'mongoose';

interface TicketRequest {
  email: string;
  subject: string;
  description: string;
}

interface TicketResponse {
  _id: string;
  email: string;
  subject: string;
  status: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    await connectDB();
    const ticketDoc = await Ticket.findById(ticketId)
      .select('_id email subject status')
      .lean<ITicket & { _id: mongoose.Types.ObjectId }>();

    if (!ticketDoc) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket: TicketResponse = {
      _id: ticketDoc._id.toString(),
      email: ticketDoc.email,
      subject: ticketDoc.subject,
      status: ticketDoc.status,
    };

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: TicketRequest = await request.json();
    const { email, subject, description } = body;

    if (!email || !subject || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const ticket = new Ticket({
      email,
      subject,
      description,
      status: 'open',
    });

    await ticket.save();

    return NextResponse.json({ ticketId: ticket._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
