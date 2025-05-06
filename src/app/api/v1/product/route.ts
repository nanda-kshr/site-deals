import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Product';

// The correct way to get params in App Router route handlers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body._id;
    await connectDB();

    const product = await Product.findById(id)
      .select('name fileId attributes price rating discountPercentage description category stock createdAt gallery designTypes material packageSize')
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
      fileId: product.fileId,
      gallery: product.gallery || [],
      price: product.price,
      rating: product.rating,
      attributes: {
        size: product.attributes?.size?.map(size => ({
          value: size.value,
          price: size.price,
          stock: size.stock
        })) || [],
        color: product.attributes?.color?.map(color => ({
          value: color.value,
          price: color.price,
          stock: color.stock
        })) || []
      },
      discountPercentage: product.discountPercentage,
      description: product.description,
      category: product.category,
      designTypes: product.designTypes || [],
      stock: product.stock,
      material: product.material,
      packageSize: product.packageSize,
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