import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Product';
import mongoose from 'mongoose';

interface ProductResponse {
  _id: string;
  name: string;
  srcUrl: string;
  gallery: string[];
  price: number;
  discountPercentage: number;
  rating: number;
  designTypes: string[];
  description?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productDoc = await Product.findById(id)
      .select('name srcUrl gallery price discountPercentage rating designTypes description')
      .lean<IProduct & { _id: mongoose.Types.ObjectId }>();

    if (!productDoc) {
      console.warn(`No product found with ID: ${id}`);
    } else {
      console.log('Product Document:', productDoc);
    }
    if (!productDoc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product: ProductResponse = {
      _id: productDoc._id.toString(),
      name: productDoc.name,
      srcUrl: productDoc.srcUrl,
      gallery: productDoc.gallery,
      price: productDoc.price,
      discountPercentage: productDoc.discountPercentage,
      rating: productDoc.rating,
      designTypes: productDoc.designTypes,
      description: productDoc.description,
    };

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}