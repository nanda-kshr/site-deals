import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

interface OrderRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body: OrderRequest = await request.json();
    const { name, email, phone, address, items } = body;

    // Basic validation
    if (!name || !email || !phone || !address) {
      return NextResponse.json({ error: 'Missing required customer fields' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Validate all items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.productId || !item.size || !item.color) {
        return NextResponse.json({ error: 'Each item must have a productId, size, and color' }, { status: 400 });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      // Calculate price with size/color-specific attributes
      let itemPrice = product.price;
      if (product.attributes?.size) {
        const sizeAttr = product.attributes.size.find((s: { value: string; price?: number }) => s.value === item.size);
        if (sizeAttr?.price) itemPrice = sizeAttr.price;
      }
      if (product.attributes?.color) {
        const colorAttr = product.attributes.color.find((c: { value: string; price?: number }) => c.value === item.color);
        if (colorAttr?.price) itemPrice = colorAttr.price;
      }

      const quantity = item.quantity || 1;
      const discountPercentage = product.discountPercentage || 0;
      const discountedPrice = itemPrice - (itemPrice * discountPercentage / 100);
      const itemTotal = discountedPrice * quantity;

      totalAmount += itemTotal;

      // Add to order items
      orderItems.push({
        productId: item.productId,
        quantity,
        size: item.size,
        color: item.color,
      });
    }

    // Round to 2 decimal places
    totalAmount = Number(totalAmount.toFixed(2));

    // Create the order
    const order = new Order({
      name,
      email,
      phone,
      address,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const savedOrder = await order.save();
    const orderId = savedOrder._id.toString();

    // Create payment session with Cashfree
    const cashfreeOptions = {
      method: "POST",
      headers: {
        "x-api-version": "2025-01-01",
        "x-client-id": process.env.PAYMENT_APP_ID || "",
        "x-client-secret": process.env.PAYMENT_SECRET || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_amount: totalAmount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: `cust_${phone.replace(/\+/g, '')}`,
          customer_phone: phone,
          customer_email: email,
          customer_name: name,
        },
        order_meta: {
          return_url: `https://www.sitedeals.store/order/success?orderId=${orderId}`,
          notify_url: `https://www.sitedeals.store/api/v1/orders/verify`,
        },
      }),
    };

    const cashfreeResponse = await fetch(
      `https://${process.env.CASHFREE_ENVIRONMENT || 'sandbox'}.cashfree.com/pg/orders`,
      cashfreeOptions
    );

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error('Cashfree API error:', cashfreeData);
      throw new Error(cashfreeData.message || "Failed to create Cashfree order");
    }

    const paymentSessionId = cashfreeData.payment_session_id;

    return NextResponse.json(
      {
        orderId,
        paymentSessionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}