import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import MailVerification  from '@/models/MailVerification';
import nodemailer from 'nodemailer';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request: Request) {
  try {
    await connectDB();
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await MailVerification.create({
      email: order.email,
      otp,
      expiresAt,
    });

    // No need to save OTP in order as it's already stored in MailVerification

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.email,
      subject: 'Order Confirmation and OTP',
      text: `Thank you for your order! Your OTP is ${otp}. It expires in 15 minutes.`,
    });

    return NextResponse.json({ message: 'Confirmation email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}