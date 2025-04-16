import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order, { IOrder } from '@/models/Order';

interface VerifyRequest {
  orderId: string;
}

interface OrderResponse {
  status: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: VerifyRequest = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orderDoc = await Order.findById(orderId).select('status').lean<IOrder>();

    if (!orderDoc) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order: OrderResponse = {
      status: orderDoc.status,
    };

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error verifying order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}