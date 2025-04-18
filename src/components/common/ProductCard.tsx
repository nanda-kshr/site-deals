import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"; // Changed to named import
import { cn } from "@/lib/utils";
import { Product } from "@/types/product.types";
import { Heart, ShoppingBag, ImageOff } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import axios from "axios";

type ProductCardProps = {
  data: Product;
  className?: string;
};

export default function ProductCard({ data, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Reset states when fileId changes
    setImageUrl(null);
    setImageLoading(true);
    setImageError(false);
    
    const fetchImageData = async () => {
      try {
        // Make POST request to get the image
        const response = await axios.post('/api/v1/image', {
          file_id: data.fileId,
        }, {
          responseType: 'blob' // Important: we need the response as a blob
        });
        
        console.log(response);
        console.log("afnjanf----f-wefwe-fw-ef-")
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        setImageLoading(false);
      } catch (error) {
        console.error(`Failed to load image for product ${data.id}:`, error);
        setImageLoading(false);
        setImageError(true);
      }
    };

    if (data.fileId) {
      fetchImageData();
    }
    
    // Cleanup function to revoke object URLs when component unmounts or fileId changes
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [data.fileId, data.id]);

  // Loading animation variants
  const shimmerVariants = {
    initial: {
      backgroundPosition: "-300px 0",
    },
    animate: {
      backgroundPosition: "300px 0",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 0.95, opacity: 0.8 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.0,
      } 
    },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prioritize global price, fallback to first attribute price
    const price = data.price || data.attributes?.size[0]?.price || data.attributes?.color[0]?.price || 0;
    dispatch(
      addToCart({
        id: String(data.id),
        title: data.title,
        fileId: data.fileId,
        price: price,
        quantity: 1,
      })
    );
  };

  // Use global price with attribute fallback
  const price = data.price || data.attributes?.size[0]?.price || data.attributes?.color[0]?.price || 0;

  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-md overflow-hidden h-full flex flex-col border border-black/10 hover:border-black/30 transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/shop/product/${data.id}`} className="block h-full">
        <div className="relative pt-[100%] overflow-hidden bg-[#FAFAFA]">
          {imageLoading ? (
            // Enhanced loading skeleton
            <motion.div 
              className="absolute inset-0"
              initial="initial"
              animate="animate"
            >
              {/* Background shimmer effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:600px_100%]"
                variants={shimmerVariants}
              />
              
              {/* Product placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm"
                  variants={pulseVariants}
                >
                  <ShoppingBag size={24} className="text-gray-400" />
                </motion.div>
                
                {/* Fake content lines */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
                  <motion.div 
                    className="h-3 w-2/3 bg-gray-200 rounded mb-2"
                    variants={shimmerVariants}
                  />
                  <motion.div 
                    className="h-3 w-1/2 bg-gray-200 rounded mb-4"
                    variants={shimmerVariants}
                  />
                  <motion.div 
                    className="h-4 w-1/4 bg-gray-300 rounded"
                    variants={shimmerVariants}
                  />
                </div>
              </div>
            </motion.div>
          ) : imageError ? (
            // Enhanced error state
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/90">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-3 rounded-full shadow-sm mb-2"
              >
                <ImageOff size={28} className="text-red-400" />
              </motion.div>
              <motion.span 
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-xs font-medium text-gray-600"
              >
                Image unavailable
              </motion.span>
            </div>
          ) : (
            // Successfully loaded image with fade-in effect
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrl || ''}
                alt={data.title}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            </motion.div>
          )}
          
          {data.discount > 0 && !imageLoading && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-3 left-3 bg-black text-white text-xs font-medium py-1 px-2 rounded"
            >
              -{data.discount}%
            </motion.div>
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
          {imageLoading ? (
            // Loading state for text content
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
            </div>
          ) : (
            // Actual content
            <>
              <h3 className="font-medium text-black text-base mb-1 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                {data.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={cn("text-xs", i < Math.floor(data.rating || 0) ? "text-black" : "text-black/30")}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-black/60">({(data.rating || 0).toFixed(1)})</span>
              </div>
              
              <div className="flex items-center gap-2 mt-auto">
                <span className="font-semibold text-black">
                  ${price.toFixed(2)}
                </span>
                {data.discount > 0 && (
                  <span className="text-black/50 text-sm line-through">
                    ${(data.price || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button 
        className={cn(
          "absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-black/10 transition-all duration-300",
          isHovered && !imageLoading ? "opacity-100" : "opacity-0"
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