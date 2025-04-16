"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-green-600">
          <FaCheckCircle className="text-6xl mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-black">
          Thank you for your order!
        </h1>
        <p className="text-lg text-black/70">
          Your payment was successful, and your order has been placed.
        </p>
        {orderId && (
          <p className="text-black">
            <strong>Order ID:</strong> {orderId}
          </p>
        )}
        <p className="text-black/60">
          You will receive a confirmation email with your order details shortly.
        </p>
        <div className="space-y-4">
          <Button asChild className="bg-black text-white rounded-full w-full py-3">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full w-full py-3">
            <Link href="/order">Track Your Order</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}