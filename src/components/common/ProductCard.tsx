// app/components/common/ProductCard.tsx

"use client";
import { Product } from "@/types/product.types";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Rating from "@/components/ui/Rating";
import { Heart } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";

interface ProductCardProps {
  data: Product;
}

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const discountPercentage = data.discount || 0;
  const discountedPrice =
    discountPercentage > 0
      ? data.price * (1 - discountPercentage / 100)
      : data.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id: String(data.id),
        title: data.title,
        srcUrl: data.srcUrl,
        price: data.price,
        discount: data.discount || 0,
        rating: data.rating,
        quantity: 1,
      })
    );
  };

  return (
    <Link href={`/shop/product/${data.id}`} className="block group" >
      <div className="bg-white border border-black/10 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
        {data.rating >= 4.0 && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-10 shadow-sm">
            Top Rated
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10 shadow-sm animate-pulse">
            -{discountPercentage}% off
          </span>
        )}
        {(typeof data.stock === 'number' && data.stock < 5) && (
          <span className="absolute bottom-2 left-2 text-red-600 text-xs font-medium z-10">
            {data.stock ? `Only ${data.stock} left!` : "Low Stock"}
          </span>
        )}
        <div className="relative w-full h-[200px] bg-[#F0EEED]">
          <Image
            src={data.srcUrl}
            fill
            alt={data.title}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 space-y-3">
          <h3
            className={cn(
              integralCF.className,
              "text-lg font-bold text-black truncate"
            )}
          >
            {data.title}
          </h3>
          <div className="flex items-center gap-2">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={16}
              readonly
            />
            <span className="text-xs text-black/60">
              {data.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {discountPercentage > 0 ? (
              <>
                <span className="font-bold text-xl text-black">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-black/40 line-through">
                  ${data.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-xl text-black">
                ${data.price.toFixed(2)}
              </span>
            )}
          </div>
          {data.soldCount && (
            <p className="text-xs text-black/60">{String(data.soldCount)} sold</p>
          )}
          <div className="flex gap-2">
            <button
              className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="px-4 py-2 border border-black text-black rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                console.log(`View details for ${data.title}`);
              }}
            >
              View
            </button>
            <button
              className="p-2 border border-black rounded-lg hover:bg-black hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Add ${data.title} to wishlist`);
              }}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;