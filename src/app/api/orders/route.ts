import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectDB();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
    const orders = await db.collection("orders").find({}).toArray();
    
    // Fetch product details for each item in each order
    const ordersWithProductDetails = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProductDetails = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order.items.map(async (item: { productId: any; }) => {
            const product = await db.collection("products").findOne({ 
              _id: item.productId 
            });
            
            return {
              ...item,
              productDetails: {
                name: product?.name || "Unknown Product",
                price: product?.price || 0,
                fileId: product?.fileId || "",
              }
            };
          })
        );
        
        return {
          ...order,
          items: itemsWithProductDetails
        };
      })
    );
    
    return NextResponse.json(ordersWithProductDetails);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
} 