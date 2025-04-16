import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MailVerification from '@/models/MailVerification';

interface VerifyRequest {
  email: string;
  otp: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: VerifyRequest = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const verification = await MailVerification.findOne({ email, otp });
    if (!verification) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > verification.expiresAt) {
      await MailVerification.deleteOne({ _id: verification._id });
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    await MailVerification.deleteOne({ _id: verification._id });
    return NextResponse.json({ message: 'OTP verified' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}