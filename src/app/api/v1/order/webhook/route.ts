import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";


interface WebhookPayload {
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_tags: null | Record<string, unknown>;
    };
    payment?: {
      cf_payment_id?: string;
      payment_status?: string;
      payment_amount?: number;
      payment_currency?: string;
      payment_message?: string;
      payment_time?: string;
      bank_reference?: string;
      auth_id?: null | string;
      payment_method?: {
        payment_method_type?: string;
        payment_method_details?: Record<string, unknown>;
      };
      payment_group?: string;
    };
    customer_details?: {
      customer_name?: null | string;
      customer_id?: string;
      customer_email?: string;
      customer_phone?: string;
    };
    payment_gateway_details?: {
      gateway_name?: string;
      gateway_order_id?: string;
      gateway_payment_id?: string;
      gateway_order_reference_id?: string;
      gateway_settlement?: string;
      gateway_status_code?: null | string;
    };
    payment_offers?: Array<{
      offer_id?: string;
      offer_type?: string;
      offer_meta?: {
        offer_title?: string;
        offer_description?: string;
        offer_code?: string;
        offer_start_time?: string;
        offer_end_time?: string;
      };
      offer_redemption?: {
        redemption_status?: string;
        discount_amount?: number;
        cashback_amount?: number;
      };
    }>;
  };
  event_time: string;
  type: string;
}

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB().catch((error) => {
      console.error("Database connection failed:", error);
      throw new Error("Failed to connect to database");
    });

    // Parse and validate payload
    const body: WebhookPayload = await request.json();
    const { data, event_time, type } = body;

    if (!data || !type || !event_time) {
      return NextResponse.json(
        { error: "Missing orderId or paymentStatus" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(data.order.order_id)) {
      console.warn("Invalid orderId format:", data.order.order_id);
      return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
    }


    const order = await Order.findById(data.order.order_id);
    if (!order) {
      console.warn(`Order not found: ${data.order.order_id}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update status based on paymentStatus
    if (
      data.payment?.payment_status && 
      ["completed", "success", "paid"].includes(data.payment.payment_status.toLowerCase())
    ) {
      order.status = "processing"; // Using a valid status from the enum
    } else {
      order.status = "pending"; // Default to a valid status
      console.warn(
        `Unexpected paymentStatus for order ${data.order.order_id}: ${data.payment?.payment_status}`
      );
    }

    await order.save();
    console.log(`Order ${data.order.order_id} updated to status: ${order.status}`);

    // Return success response
    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  }
}
