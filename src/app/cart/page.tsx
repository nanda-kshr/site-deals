"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import React from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const cartState = useAppSelector((state: RootState) => state.carts);
  const items = cartState?.items || [];

  const totalPrice = cartState?.totalPrice || 0;
  const adjustedTotalPrice = cartState?.adjustedTotalPrice || 0;

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty. Please add items before proceeding to checkout.");
      return;
    }
    const itemIds = items.map((item) => item.id).join(",");
    router.push(`/checkout?itemIds=${itemIds}`);
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0">
        {items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
              ])}
            >
              Your Cart
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black">
                {items.map((product, idx, arr) => (
                  <React.Fragment key={idx}>
                    <ProductCard data={product} />
                    {arr.length - 1 !== idx && <hr className="border-t-black" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="w-full lg:max-w-[505px] p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black bg-white">
                <h6 className="text-xl md:text-2xl font-bold text-black">
                  Order Summary
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Subtotal</span>
                    <span className="md:text-xl font-bold text-black">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Discount</span>
                    <span className="md:text-xl font-bold text-red-600">
                      -₹{(totalPrice - adjustedTotalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black/60">Delivery Fee</span>
                    <span className="md:text-xl font-bold text-black">Free</span>
                  </div>
                  <hr className="border-t-black" />
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-black">Total</span>
                    <span className="text-xl md:text-2xl font-bold text-black">
                      ₹{adjustedTotalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <InputGroup className="bg-black/10">
                    <InputGroup.Text>
                      <MdOutlineLocalOffer className="text-black/60 text-2xl" />
                    </InputGroup.Text>
                    <InputGroup.Input
                      type="text"
                      name="code"
                      placeholder="Add promo code"
                      className="bg-transparent placeholder:text-black/60"
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    className="bg-black text-white rounded-full w-full max-w-[119px] h-[48px]"
                    onClick={() => alert("We're sorry, coupon codes are available exclusively for our regular customers")}
                  >
                    Apply
                  </Button>
                </div>
                <Button
                  type="button"
                  className="text-sm md:text-base font-medium bg-black text-white rounded-full w-full py-4 h-[54px] md:h-[60px] group"
                  onClick={handleCheckout}
                >
                  Go to Checkout{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all text-white" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center flex-col text-black/60 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl text-black/40" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Link href="/shop" className="rounded-full w-24 text-black underline hover:text-black/80">
              Shop
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}