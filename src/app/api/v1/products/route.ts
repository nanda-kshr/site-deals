import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

import type { Product as ProductType } from "@/types/product.types";
interface ProductResponse {
  _id: string;
  name: string;
  fileId: string;
  gallery: string[];
  description: string;
  createdAt: string;
  attributes?: {
    size: { value: string; price: number; fileId: string }[];
    color: { value: string; price: number; fileId: string }[];
  };
  rating?: number;
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
      .skip(skip)
      .limit(limit)
      .lean<Array<ProductType & { _id: mongoose.Types.ObjectId }>>()
      .then((docs) =>
        docs.map((doc) => {
          const createdAt = typeof doc.createdAt === "string" && doc.createdAt
            ? doc.createdAt
            : new Date().toISOString();
          return {
            _id: doc._id.toString(),
            name: doc.name,
            fileId: doc.fileId,
            gallery: doc.gallery || [],
            description: doc.description || "",
            price: doc.price,
            createdAt: createdAt,
            attributes: doc.attributes || { size: [], color: [] },
            rating: doc.rating || 0,
          };
        })
      )) as ProductResponse[];

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}