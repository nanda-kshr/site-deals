"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";

import { Product } from "@/types/product.types";
import React from "react";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={() =>
        dispatch(
          addToCart({
            id: String(data.id || ''),
            title: data.title,
            srcUrl: data.srcUrl,
            price: data.price,
            discount: data.discount,
            quantity: data.quantity,
            rating: data.rating,

          })
        )
      }
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
