"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrderPage() {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState<null | {
    email: string;
    phone: string;
    productId: string;
    quantity: number;
    variant: string;
    size: string;
    status: string;
    address: string;
    otp: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/order/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details. Please try again.");
      }

      const data = await response.json();
      setOrderDetails(data);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <h2 className="font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6">
          Track Your Order
        </h2>

        {/* Order ID Input */}
        <div className="flex flex-col items-start space-y-4 mb-8">
          <Input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="border-black/20 text-black w-full max-w-sm"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            onClick={handleTrackOrder}
            disabled={isLoading}
            className="bg-black text-white rounded-full px-6 py-3"
          >
            {isLoading ? "Tracking..." : "Track Order"}
          </Button>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="p-5 rounded-[20px] border border-black/10 w-full max-w-lg">
            <h3 className="text-xl font-bold text-black mb-4">Order Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {orderDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {orderDetails.phone}
              </p>
              <p>
                <strong>Product ID:</strong> {orderDetails.productId}
              </p>
              <p>
                <strong>Quantity:</strong> {orderDetails.quantity}
              </p>
              <p>
                <strong>Variant:</strong> {orderDetails.variant}
              </p>
              <p>
                <strong>Size:</strong> {orderDetails.size}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    orderDetails.status === "paid"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {orderDetails.status}
                </span>
              </p>
              <p>
                <strong>Address:</strong> {orderDetails.address}
              </p>
              <p>
                <strong>OTP:</strong> {orderDetails.otp}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}