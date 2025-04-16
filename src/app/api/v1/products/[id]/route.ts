import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const productId = request?.nextUrl?.searchParams.get('orderId')
   
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Use the interface for proper typing
    const product = await Product.findById(productId)
        .select('name srcUrl price rating discountPercentage description category stock createdAt')
        .lean() as unknown as IProduct;
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productResponse = {
      _id: product._id?.toString() || "",
      name: product.name,
      srcUrl: product.srcUrl,
      price: product.price,
      rating: product.rating,
      discount: product.discountPercentage,
      description: product.description,
      category: product.category,
      stock: product.stock,
      createdAt: product.createdAt
    };

    return NextResponse.json(productResponse, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}