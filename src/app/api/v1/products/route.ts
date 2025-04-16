import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import mongoose from "mongoose";

interface ProductResponse {
  _id: string;
  name: string;
  srcUrl: string;
  price: number;
  rating: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Invalid limit parameter" },
        { status: 400 }
      );
    }
    if (isNaN(skip) || skip < 0) {
      return NextResponse.json(
        { error: "Invalid skip parameter" },
        { status: 400 }
      );
    }

    await connectDB();
    const products = (await Product.find()
      .select("name srcUrl price rating discountPercentage")
      .skip(skip)
      .limit(limit)
      .lean<Array<IProduct & { _id: mongoose.Types.ObjectId }>>()
      .then((docs) =>
        docs.map((doc) => ({
          _id: doc._id.toString(),
          name: doc.name,
          srcUrl: doc.srcUrl,
          price: doc.price,
          discount: doc.discountPercentage,
          rating: doc.rating,
        }))
      )) as ProductResponse[];

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
