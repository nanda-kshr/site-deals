import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import MailVerification from '@/models/MailVerification';
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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Create HTML email template for OTP verification
    const otpEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000000; margin-bottom: 10px;">Verify Your Order</h1>
          <p style="color: #666666; font-size: 16px;">Thank you for shopping with Site Deals!</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #000000; margin-bottom: 15px;">Order Details</h2>
          <p style="margin: 5px 0; color: #444444;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 5px 0; color: #444444;"><strong>Customer Name:</strong> ${order.name}</p>
        </div>

        <div style="background-color: #000000; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin-bottom: 10px;">Your Verification Code</h2>
          <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">${otp}</div>
          <p style="font-size: 14px; margin-top: 10px;">This code will expire in 15 minutes</p>
        </div>

        <div style="text-align: center; color: #666666; font-size: 14px;">
          <p>If you didn't request this verification code, please ignore this email.</p>
          <p>For security reasons, please do not share this code with anyone.</p>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999999;">
          <p>© ${new Date().getFullYear()} Site Deals. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `;

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.email,
      subject: `Verify Your Site Deals Order #${orderId}`,
      html: otpEmailHtml,
      text: `Your verification code for Site Deals Order #${orderId} is: ${otp}. This code will expire in 15 minutes.`,
    });

    return NextResponse.json({ message: 'Confirmation email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}