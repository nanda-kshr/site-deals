import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface FeedbackRequest {
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: FeedbackRequest = await request.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

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
      from: email,
      to: process.env.SMTP_FEEDBACK_TO,
      subject: `Feedback: ${subject}`,
      text: `From: ${email}\n\n${message}`,
    });

    return NextResponse.json({ message: 'Feedback sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}