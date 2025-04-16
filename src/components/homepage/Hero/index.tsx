import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import * as motion from "framer-motion/client";
import { Product } from "@/types/product.types";
import axios from "axios";
import { ImageOff } from "lucide-react";

type HeroProps = {
  bestFeature?: Product | null;
};


const Hero = ({ bestFeature }: HeroProps) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const [featureImageUrl, setFeatureImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset states when bestFeature changes
    setFeatureImageUrl(null);
    setImageLoading(true);
    setImageError(false);
    
    const fetchFeatureImage = async () => {
      // If there's no bestFeature or no fileId, don't attempt to fetch
      if (!bestFeature?.fileId) {
        setImageLoading(false);
        return;
      }
      
      try {
        // Make POST request to get the image
        const response = await axios.post('/api/v1/image', {
          file_id: bestFeature.fileId,
        }, {
          responseType: 'blob' // Important: we need the response as a blob
        });
        
        // Create a temporary URL for the blob data
        const url = URL.createObjectURL(response.data);
        setFeatureImageUrl(url);
        setImageLoading(false);
        
      } catch (error) {
        console.error('Failed to load feature image:', error);
        setImageLoading(false);
        setImageError(true);
      }
    };

    fetchFeatureImage();
    
    // Cleanup function to revoke object URLs when component unmounts or bestFeature changes
    return () => {
      if (featureImageUrl) {
        URL.revokeObjectURL(featureImageUrl);
      }
    };
  }, [bestFeature]);

  // Loading animation variants
  const shimmerVariants = {
    initial: {
      backgroundPosition: "-500px 0",
    },
    animate: {
      backgroundPosition: "500px 0",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  const loadingContainerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    },
  };

  const loadingDotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 0.8,
      }
    },
  };

  return (
    <header className="bg-gradient-to-b from-white to-gray-100 pt-5 md:pt-8 overflow-hidden">
      <div className="relative md:max-w-frame mx-[var(--content-margin)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative px-4 py-6 md:py-10 mb-4 md:mb-8 rounded-xl bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 flex flex-col justify-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-2 py-1 px-4 bg-blue-600 text-white rounded-full text-sm font-medium max-w-fit"
              >
                {formattedDate} • DEALS OF THE DAY
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={cn([
                  integralCF.className,
                  "text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4",
                ])}
              >
                DISCOVER WHAT<br className="hidden md:block" /> YOU NEED FASTER
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-black/70 text-sm md:text-base mb-4 lg:mb-6 max-w-[545px]"
              >
                Shop millions of products with fast delivery and competitive prices.
                Find everything from electronics to household essentials in one place.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/deals"
                  className="group bg-amber-500 hover:bg-amber-600 transition-all text-white px-6 py-3 rounded-lg hover:shadow-md"
                  >
                  <span className="flex items-center gap-2">
                    Shop Deals
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform transition-transform group-hover:translate-x-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/best-sellers"
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg hover:shadow-md transition-all"
                >
                  Best Sellers
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="md:col-span-2 flex items-center justify-center relative"
            >
              {bestFeature ? (
                <div className="relative w-full h-[180px] md:h-[240px] flex flex-col items-center">
                  <Link href={`/shop/product/${bestFeature.id}`} className="block w-full h-full relative">
                    {imageLoading ? (
                      // Enhanced loading skeleton
                      <motion.div 
                        className="absolute inset-0 rounded-lg overflow-hidden"
                        initial="initial"
                        animate="animate"
                      >
                        {/* Background shimmer effect */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:800px_100%]"
                          variants={shimmerVariants}
                        />
                        
                        {/* Loading indicator */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 mb-4 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <motion.div
                              variants={loadingContainerVariants}
                              initial="initial"
                              animate="animate"
                              className="flex gap-1"
                            >
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  variants={loadingDotVariants}
                                  className="w-2 h-2 rounded-full bg-blue-500"
                                />
                              ))}
                            </motion.div>
                          </div>
                          <span className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            Loading product...
                          </span>
                        </div>
                      </motion.div>
                    ) : imageError ? (
                      // Enhanced error state
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 backdrop-blur-sm rounded-lg">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white p-4 rounded-full shadow-md mb-3"
                        >
                          <ImageOff size={32} className="text-red-500" />
                        </motion.div>
                        <motion.span 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="text-sm font-medium text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm"
                        >
                          Image unavailable
                        </motion.span>
                      </div>
                    ) : (
                      // Successfully loaded image with fade-in effect
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full relative"
                      >
                        <Image
                          priority
                          src={featureImageUrl || ''}
                          fill
                          alt={bestFeature.title}
                          className="object-contain rounded-lg"
                          aria-label={`Featured product: ${bestFeature.title}`}
                          onError={() => setImageError(true)}
                        />
                      </motion.div>
                    )}
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute -bottom-4 right-0 md:-right-4 bg-white p-2 md:p-3 rounded-lg shadow-lg max-w-[140px] border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium">Best Seller</span>
                    </div>
                    {bestFeature.discount > 0 ? (
                      <>
                        <span className="font-bold text-lg md:text-xl text-amber-500">
                          -{bestFeature.discount}%
                        </span>
                        <span className="text-gray-600 text-xs block">
                          ${(bestFeature.price * (1 - bestFeature.discount / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-lg md:text-xl text-amber-500">
                        ${bestFeature.price.toFixed(2)}
                      </span>
                    )}
                  </motion.div>
                </div>
              ) : (
                <div className="relative h-[180px] md:h-[240px] w-full">
                  <Image
                    priority
                    src="/images/header-homepage.png"
                    fill
                    alt="Featured products"
                    className="object-contain"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute -bottom-4 right-0 md:-right-4 bg-white p-2 md:p-3 rounded-lg shadow-lg max-w-[140px] border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium">Flash Deal</span>
                    </div>
                    <span className="font-bold text-lg md:text-xl text-amber-500">-40%</span>
                    <span className="text-gray-600 text-xs block">Limited time</span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 px-4 mb-8"
        >
          {[
            { name: "Electronics", icon: "🖥️", color: "bg-blue-50" },
            { name: "Home & Kitchen", icon: "🏠", color: "bg-green-50" },
            { name: "Toys & Games", icon: "🎮", color: "bg-purple-50" },
            { name: "Books", icon: "📚", color: "bg-yellow-50" },
            { name: "Health", icon: "💊", color: "bg-red-50" },
            { name: "Grocery", icon: "🛒", color: "bg-orange-50" },
          ].map((category, index) => (
            <Link
              key={index}
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`${category.color} rounded-xl p-4 hover:shadow-md transition-all flex flex-col items-center justify-center text-center`}
              >
                <div>
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="font-medium text-sm">{category.name}</span>
                </div>
              
            </Link>
          ))}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl mx-4 px-6 py-5 mb-6 md:mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 items-center">
            <div className="flex flex-col items-center sm:items-start sm:border-r border-gray-200 sm:pr-4">
              <span className="font-bold text-2xl md:text-xl lg:text-3xl">
                <AnimatedCounter from={0} to={50} />M+
              </span>
              <span className="text-xs text-gray-600">Products Available</span>
            </div>
            <div className="flex flex-col items-center sm:border-r border-gray-200 sm:px-4">
              <span className="font-bold text-2xl md:text-xl lg:text-3xl">
                <AnimatedCounter from={0} to={100} />M+
              </span>
              <span className="text-xs text-gray-600">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center sm:items-end sm:pl-4">
              <span className="font-bold text-2xl md:text-xl lg:text-3xl">
                <AnimatedCounter from={0} to={90} />%
              </span>
              <span className="text-xs text-gray-600">Same-Day Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;