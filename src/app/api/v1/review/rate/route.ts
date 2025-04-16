import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

interface RateRequest {
  email: string;
  productId: string;
  rating: number;
  review: string;
}

export async function POST(request: Request) {
  try {

    await connectDB();
    const body: RateRequest = await request.json();
    const { email, productId, rating, review } = body;

    if (!productId || !rating || !review) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newReview = new Review({
      productId,
      email: email,
      rating,
      review,
    });

    await newReview.save();

    // Recalculate product rating
    const reviews = await Review.find({ productId }).select('rating');
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.rating = Number(avgRating.toFixed(1));
    await product.save();

    return NextResponse.json({ message: 'Review submitted' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}