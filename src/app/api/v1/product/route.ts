import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Product';

// The correct way to get params in App Router route handlers
export async function POST(request: Request) {
  try {
   
    const body = await request.json();
    const {id} = body
    await connectDB();
    
    // Parse the request body
    
    // Use the interface for proper typing
    const product = await Product.findById(id)
        .select('name srcUrl price rating discountPercentage description category stock createdAt gallery designTypes')
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
      gallery: product.gallery || [],
      price: product.price,
      rating: product.rating,
      discountPercentage: product.discountPercentage,
      description: product.description,
      category: product.category,
      designTypes: product.designTypes || [],
      stock: product.stock,
      createdAt: product.createdAt
    };

    return NextResponse.json(productResponse, { status: 200 });
  } catch (error) {
    console.error('Error processing product request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}