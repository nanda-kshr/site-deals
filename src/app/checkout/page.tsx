"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/redux";
import { Button } from "@/components/ui/button";
import { load } from "@cashfreepayments/cashfree-js";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";
import { RootState } from "@/lib/store";
import axios from "axios";
import { getimage } from "@/lib/constants";

interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const cartState = useAppSelector((state: RootState) => state.carts);
  const [step, setStep] = useState<"contact" | "email" | "otp">("contact");
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  
  // Checkout state
  const [checkoutItems, setCheckoutItems] = useState<Array<any>>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string>("");
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modified useEffect to properly handle cart items
  useEffect(() => {
    try {
      const itemIds = searchParams.get("itemIds")?.split(",") || [];
      if (!itemIds.length) {
        setLoadError("No items found in checkout. Please add items to your cart first.");
        return;
      }

      // Debug log to see what we're working with
      console.log('Cart state items:', cartState.items);
      console.log('Item IDs from URL:', itemIds);

      const filteredItems = cartState.items.filter((item) => {
        const itemUniqueId = `${item.id}_${item.size || 'default'}_${item.color || 'default'}`;
        const isMatch = itemIds.includes(itemUniqueId);
        console.log('Checking item:', {
          itemId: item.id,
          size: item.size,
          color: item.color,
          uniqueId: itemUniqueId,
          isMatch
        });
        return isMatch;
      });

      if (!filteredItems.length) {
        setLoadError("Could not find the selected items. They may have been removed from your cart.");
        return;
      }

      console.log('Filtered items for checkout:', filteredItems);
      setCheckoutItems(filteredItems);
      setLoadError(null);
    } catch (error) {
      console.error('Error loading checkout items:', error);
      setLoadError("An error occurred while loading your checkout items. Please try again.");
    }
  }, [searchParams, cartState.items]);

  // Handle image loading
  useEffect(() => {
    let isMounted = true;

    const fetchImageData = async (fileId: string) => {
      if (!fileId || imageUrls[fileId]) return;

      try {
        setImageLoading((prev) => ({ ...prev, [fileId]: true }));
        setImageError((prev) => ({ ...prev, [fileId]: false }));

        const response = await axios.post(
          getimage,
          { file_id: fileId },
          { responseType: "blob" }
        );

        if (!isMounted) return;

        const url = URL.createObjectURL(response.data);
        setImageUrls((prev) => ({ ...prev, [fileId]: url }));
        setImageLoading((prev) => ({ ...prev, [fileId]: false }));
      } catch (error) {
        if (!isMounted) return;
        console.error(`Failed to load image for fileId ${fileId}:`, error);
        setImageLoading((prev) => ({ ...prev, [fileId]: false }));
        setImageError((prev) => ({ ...prev, [fileId]: true }));
      }
    };

    checkoutItems.forEach((item) => {
      if (item.fileId) {
        fetchImageData(item.fileId);
      }
    });

    return () => {
      isMounted = false;
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [checkoutItems]);

  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Please enter your address");
      return false;
    }
    return true;
  };

  // Initialize Cashfree payment
  const initiatePayment = async (sessionId: string) => {
    if (!sessionId) {
      console.error("Payment session ID is missing");
      setError("Payment session ID is missing. Please try again.");
      return;
    }

    try {
      const cashfree = await load({
        mode: "sandbox", // Change to "production" for live
      });

      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setError("Payment initiation failed. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    
    setError(null);
    setIsLoading(true);

    try {
      // Validate checkout items
      if (!checkoutItems || checkoutItems.length === 0) {
        throw new Error("No items found in checkout. Please add items to your cart first.");
      }

      const orderItems = checkoutItems.map((item) => {
        // Handle both MongoDB ObjectId and string IDs
        const productId = item._id?.$oid || item.id;
        if (!productId) {
          throw new Error("Invalid product ID found in cart items.");
        }
        return {
          productId,
          quantity: item.quantity || 1,
          size: item.size || '',
          color: item.color || '',
        };
      });

      console.log('Sending order items:', orderItems); // Debug log

      const response = await fetch("/api/v1/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: `${countryCode}${formData.phone}`,
          address: formData.address,
          items: orderItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      const data = await response.json();

      if (data.orderId && data.paymentSessionId) {
        setOrderId(data.orderId);
        setPaymentSessionId(data.paymentSessionId);
        
        if (formData.email) {
          await handleSendOtp(data.orderId, formData.email);
        } else {
          setStep("email");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
      console.error("Order creation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (orderIdToUse = orderId, emailToUse = formData.email) => {
    if (!emailToUse) {
      setError("Please enter your email.");
      return;
    }

    if (!orderIdToUse) {
      setError("Order ID is missing. Please try again.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/mail/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderIdToUse,
          email: emailToUse,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP.");
      }

      setStep("otp");
    } catch (err) {
      console.error("OTP sending failed:", err);
      setError("Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!orderId) {
      setError("Order ID is missing. Please try again.");
      return;
    }

    if (!formData.email) {
      setError("Email is missing. Please try again.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/mail/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          orderId,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP.");
      }

      if (paymentSessionId) {
        await initiatePayment(paymentSessionId);
      } else {
        setError("Payment information not found. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Invalid OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const adjustedTotalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.price * (1 - (item.discount || 0) / 100) * item.quantity,
    0
  );

  const renderStep = () => {
    if (step === "contact") {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black">Contact Information</h3>
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="border-black/20 text-black"
            required
          />
          <div className="flex space-x-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-24 border-black/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1">+1 (US)</SelectItem>
                <SelectItem value="+91">+91 (IN)</SelectItem>
                <SelectItem value="+44">+44 (UK)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="border-black/20 text-black"
              required
            />
          </div>
          <Input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="border-black/20 text-black"
            required
          />
          <Input
            type="email"
            placeholder="Email (Optional)"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="border-black/20 text-black"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            onClick={handleCheckout}
            disabled={isLoading || checkoutItems.length === 0}
            className="bg-black text-white rounded-full w-full py-3"
          >
            {isLoading ? "Processing..." : "Checkout"}
          </Button>
        </div>
      );
    }

    if (step === "email") {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black">Enter Your Email</h3>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="border-black/20 text-black"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            onClick={() => handleSendOtp()}
            disabled={isLoading}
            className="bg-black text-white rounded-full w-full py-3"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
          <Button
            onClick={() => setStep("contact")}
            variant="outline"
            className="rounded-full w-full py-3 border-black/20"
          >
            Back
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-black">Verify OTP</h3>
        <p className="text-sm text-black/60">We've sent a verification code to {formData.email}</p>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border-black/20 text-black"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button
          onClick={handleVerifyOtp}
          disabled={isLoading}
          className="bg-black text-white rounded-full w-full py-3"
        >
          {isLoading ? "Verifying..." : "Verify & Pay"}
        </Button>
        <Button
          onClick={() => setStep("email")}
          variant="outline"
          className="rounded-full w-full py-3 border-black/20"
        >
          Back
        </Button>
      </div>
    );
  };

  if (loadError) {
    return (
      <main className="pb-20 bg-white">
        <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{loadError}</p>
            <Button asChild className="mt-4 rounded-full bg-black text-white">
              <Link href="/cart">Return to Cart</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0">
        <h2
          className={cn(integralCF.className, "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6")}
        >
          Checkout
        </h2>
        {checkoutItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-black/60">No items to checkout.</p>
            <Button asChild className="mt-4 rounded-full bg-black text-white">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
            <div className="w-full lg:w-1/2 p-5 rounded-[20px] border border-black/10">
              {renderStep()}
            </div>
            <div className="w-full lg:w-1/2 p-5 rounded-[20px] border border-black/10">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-4">Order Summary</h3>
              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div key={`${item.id}_${item.size}_${item.color}`} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-[#F0EEED] rounded-md">
                      {item.fileId && (
                        <>
                          {imageLoading[item.fileId] ? (
                            <div className="animate-pulse bg-gray-200 w-full h-full rounded-md" />
                          ) : imageError[item.fileId] ? (
                            <div className="flex items-center justify-center h-full text-sm text-red-500">
                              Image unavailable
                            </div>
                          ) : imageUrls[item.fileId] ? (
                            <Image
                              src={imageUrls[item.fileId]}
                              alt={item.title}
                              fill
                              className="object-contain p-2"
                              sizes="64px"
                            />
                          ) : null}
                        </>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-black truncate">{item.title}</h4>
                      <p className="text-sm text-black/60">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " | "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-black/60">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold">
                        ₹{((item.price * (1 - (item.discount || 0) / 100)) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <hr className="border-t-black/10" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black/60">Subtotal</span>
                    <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Discount</span>
                    <span className="font-bold text-red-600">-₹{(totalPrice - adjustedTotalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Delivery Fee</span>
                    <span className="font-bold">Free</span>
                  </div>
                  <hr className="border-t-black/10" />
                  <div className="flex justify-between">
                    <span className="text-black">Total</span>
                    <span className="text-xl font-bold">₹{adjustedTotalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}