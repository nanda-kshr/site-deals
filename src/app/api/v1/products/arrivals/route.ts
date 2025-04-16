import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

interface ProductResponse {
  _id: string;
  name: string;
  srcUrl: string;
  price: number;
  rating: number;
  discount: number;
}

export async function GET() {
  try {
    await connectDB();
    // Fetch new arrivals, sorted by createdAt
    const products = await Product.find()
      .select('name srcUrl price rating discountPercentage')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          _id: doc._id?.toString() || "",
          name: doc.name,
          srcUrl: doc.srcUrl,
          price: doc.price,
          rating: doc.rating,
          discount: doc.discountPercentage,
        }))
      ) as ProductResponse[];

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}