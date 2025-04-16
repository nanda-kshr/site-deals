import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product.types";
import { Heart, ShoppingBag } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";

type ProductCardProps = {
  data: Product;
  className?: string;
};

export default function ProductCard({ data, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const discountedPrice = data.discount
    ? data.price * (1 - data.discount / 100)
    : data.price;

  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-md overflow-hidden h-full flex flex-col border border-black/10 hover:border-black/30 transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      <Link href={`/product/${data.id}`} className="block h-full">
        <div className="relative pt-[100%] overflow-hidden bg-[#FAFAFA]">
          <Image
            src={data.srcUrl}
            alt={data.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {data.discount > 0 && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs font-medium py-1 px-2 rounded">
              -{data.discount}%
            </div>
          )}
          
          {/* Quick action buttons */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-white/80 backdrop-blur-sm transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            )}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-black/80 transition-colors"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </motion.button>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-black text-base mb-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
            {data.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={cn("text-xs", i < Math.floor(data.rating) ? "text-black" : "text-black/30")}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-black/60">({data.rating.toFixed(1)})</span>
          </div>
          
          <div className="flex items-center gap-2 mt-auto">
            <span className="font-semibold text-black">
              ${discountedPrice.toFixed(2)}
            </span>
            {data.discount > 0 && (
              <span className="text-black/50 text-sm line-through">
                ${data.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button 
        className={cn(
          "absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-black/10 transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Add wishlist functionality here
        }}
      >
        <Heart size={16} className="text-black hover:fill-current" />
      </button>
    </motion.div>
  );
}