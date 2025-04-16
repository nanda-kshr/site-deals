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
    // Fetch best sellers, sorted by rating
    const products = await Product.find()
      .select('name srcUrl price rating discountPercentage')
      .sort({ rating: -1 })
      .limit(4)
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
    console.error('Error fetching best sellers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}