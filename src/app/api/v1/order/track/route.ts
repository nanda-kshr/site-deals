import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

interface TrackRequest {
  orderId: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: TrackRequest = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(orderId)
      .select('-_id email phone productId quantity variant size status address paymentIntentId otp')
      .lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}