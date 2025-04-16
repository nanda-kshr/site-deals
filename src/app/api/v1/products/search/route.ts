import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import mongoose from "mongoose";

interface ProductResponse {
  _id: string;
  name: string;
  fileId: string;
  price: number;
  rating: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const products = (await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .select("name fileId price rating")
      .lean<Array<IProduct & { _id: mongoose.Types.ObjectId }>>()
      .then((docs) =>
        docs.map((doc) => ({
          _id: doc._id.toString(),
          name: doc.name,
          fileId: doc.fileId,
          price: doc.price,
          rating: doc.rating,
        }))
      )) as ProductResponse[];

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
