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

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { items, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state) => state.carts || { items: [], totalPrice: 0, adjustedTotalPrice: 0 }
  );

  const [step, setStep] = useState<"contact" | "email" | "otp">("contact");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Store paymentSessionId in state to use across steps
  const [paymentSessionId, setPaymentSessionId] = useState<string>("");
  const [checkoutItems, setCheckoutItems] = useState<
    Array<{
      id: string;
      title: string;
      price: number;
      discount: number;
      quantity: number;
      variant?: string;
      size?: string;
      srcUrl?: string;
    }>
  >([]);

  // Debug state values
  useEffect(() => {
    console.log("Current payment session ID:", paymentSessionId);
    console.log("Current order ID:", orderId);
  }, [paymentSessionId, orderId]);

  // Initialize Cashfree payment
  const initiatePayment = async (sessionId: string) => {
    if (!sessionId) {
      console.error("Payment session ID is missing");
      setError("Payment session ID is missing. Please try again.");
      return;
    }

    try {
      console.log("Initiating payment with session ID:", sessionId);
      const cashfree = await load({
        mode: "sandbox",
      });
      
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };
      
      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setError("Payment initiation failed. Please try again.");
    }
  };

  // Fetch checkout items from searchParams
  useEffect(() => {
    const itemIds = searchParams.get("itemIds")?.split(",") || [];
    const filteredItems = items.filter((item) => itemIds.includes(item.id));
    
    if (filteredItems.length > 0) {
      setCheckoutItems(
        filteredItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          discount: item.discount || 0,
          quantity: item.quantity,
          srcUrl: item.srcUrl,
        }))
      );
    } else if (itemIds.length > 0 && items.length > 0) {
      console.warn("No matching items found for the provided itemIds");
    }
  }, [searchParams, items]);

  const handleCheckout = async () => {
    if (!name || !phone || !address) {
      setError("Please complete all fields.");
      return;
    }
    setError(null);
    setIsLoading(true);
    
    try {
      // We'll only create one order for all items
      // This will simplify the payment flow
      const orderItems = checkoutItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        variant: item.variant,
        size: item.size
      }));
      
      const response = await fetch("/api/v1/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || "nandakishorep212@gmail.com", // Use provided email if available
          phone: `${countryCode}${phone}`,
          address,
          items: orderItems, // Send all items in a single order
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      
      const data = await response.json();
      console.log("Order created:", data);
      
      if (data.orderId && data.paymentSessionId) {
        setOrderId(data.orderId);
        setPaymentSessionId(data.paymentSessionId);
        console.log("Set payment session ID:", data.paymentSessionId);
        
        // If email is already provided, skip to OTP step
        if (email) {
          await handleSendOtp(data.orderId, email);
        } else {
          setStep("email");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      setError("Failed to place order. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (orderIdToUse = orderId, emailToUse = email) => {
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
      console.log("Sending OTP for order:", orderIdToUse, "to email:", emailToUse);
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
      
      // Update email in state if using a different email
      if (emailToUse !== email) {
        setEmail(emailToUse);
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
    
    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Verifying OTP for order:", orderId, "email:", email, "otp:", otp);
      const response = await fetch("/api/v1/mail/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp,
          orderId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Invalid OTP.");
      }
      
      // Check if we have a payment session ID
      console.log("OTP verified, proceeding with payment using session ID:", paymentSessionId);
      if (paymentSessionId) {
        await initiatePayment(paymentSessionId);
      } else {
        // If we don't have a payment session ID, try to fetch it again
        console.error("Payment session ID is missing after OTP verification");
        setError("Payment information not found. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Invalid OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    if (step === "contact") {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black">Contact Information</h3>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-black/20 text-black"
              required
            />
          </div>
          <Input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-black/20 text-black"
            required
          />
          <Input
            type="email"
            placeholder="Email (Optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
    } else if (step === "email") {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black">Enter Your Email</h3>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
    } else if (step === "otp") {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black">Verify OTP</h3>
          <p className="text-sm text-black/60">
            We&apos;ve sent a verification code to {email}
          </p>
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
    }
    return null;
  };

  return (
    <main className="pb-20 bg-white">
      <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0">
        <h2
          className={cn(
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6"
          )}
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
              <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
                Order Summary
              </h3>
              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-[#F0EEED] rounded-md">
                      {item.srcUrl && (
                        <Image
                          src={item.srcUrl}
                          fill
                          alt={item.title}
                          className="object-contain p-2"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-black truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-black/60">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        ₹{((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
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
                    <span className="font-bold text-red-600">
                      -₹{(totalPrice - adjustedTotalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Delivery Fee</span>
                    <span className="font-bold">Free</span>
                  </div>
                  <hr className="border-t-black/10" />
                  <div className="flex justify-between">
                    <span className="text-black">Total</span>
                    <span className="text-xl font-bold">
                      ₹{adjustedTotalPrice.toFixed(2)}
                    </span>
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