"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Rating from "@/components/ui/Rating";
import { Product } from "@/types/product.types";
import { notFound } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { use } from "react";

export default function ProductPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            return notFound();
          }
          throw new Error("Failed to fetch product");
        }
        
        const data = await response.json();
        const mappedProduct: Product = {
          id: data._id,
          title: data.name,
          srcUrl: data.srcUrl,
          gallery: data.gallery || [],
          price: data.price,
          discount: data.discountPercentage || 0,
          rating: data.rating,
          designTypes: data.designTypes,
          description: data.description,
          createdAt: data.createdAt || new Date().toISOString(),
          _id: ""
        };
        
        setProduct(mappedProduct);
        setSelectedImage(mappedProduct.srcUrl);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(
      addToCart({
        id: String(product.id),
        title: product.title,
        srcUrl: product.srcUrl,
        price: product.price,
        discount: product.discount || 0,
        rating: product.rating,
        quantity: 1,
      })
    );
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error || "Product not found"}</p>
        <Link href="/shop" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="max-w-frame mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
      >
        {/* Image Section */}
        <ProductImageGallery 
          product={product} 
          selectedImage={selectedImage} 
          setSelectedImage={setSelectedImage} 
        />

        {/* Details Section */}
        <ProductDetails 
          product={product} 
          discountedPrice={discountedPrice} 
          handleAddToCart={handleAddToCart} 
        />
      </motion.div>
    </div>
  );
}

// Component for loading state
function ProductSkeleton() {
  return (
    <div className="max-w-frame mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-[300px] md:h-[400px] bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Component for product images and gallery
function ProductImageGallery({ 
  product, 
  selectedImage, 
  setSelectedImage 
}: { 
  product: Product; 
  selectedImage: string; 
  setSelectedImage: (image: string) => void; 
}) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative w-full h-[300px] md:h-[400px] bg-[#F0EEED] rounded-lg overflow-hidden"
      >
        <Image
          src={selectedImage}
          fill
          alt={product.title}
          className="object-contain p-4"
          priority
        />
      </motion.div>
      
      {/* Gallery Thumbnails */}
      {product.gallery && product.gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {[product.srcUrl, ...product.gallery].map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative w-16 h-16 rounded-md overflow-hidden border",
                selectedImage === img ? "border-blue-600" : "border-gray-200"
              )}
            >
              <Image
                src={img}
                fill
                alt={`${product.title} view ${index + 1}`}
                className="object-contain p-1"
              />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Component for product details
function ProductDetails({ 
  product, 
  discountedPrice, 
  handleAddToCart 
}: { 
  product: Product; 
  discountedPrice: number; 
  handleAddToCart: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col"
    >
      <h1 className={cn(integralCF.className, "text-2xl md:text-3xl text-black mb-2")}>
        {product.title}
      </h1>
      
      <div className="flex items-center mb-3">
        <Rating
          initialValue={product.rating}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="text-black text-sm ml-3">
          {product.rating.toFixed(1)} <span className="text-black/60">/5</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="font-bold text-2xl text-black">
          ${discountedPrice.toFixed(2)}
        </span>
        {product.discount > 0 && (
          <>
            <span className="font-bold text-black/40 line-through text-xl">
              ${product.price.toFixed(2)}
            </span>
            <span className="font-medium text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              -{product.discount}%
            </span>
          </>
        )}
      </div>
      
      <p className="text-black/70 text-sm md:text-base mb-6">
        {product.description}
      </p>
      
      {product.designTypes && product.designTypes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-black mb-2">Design Types</h3>
          <div className="flex flex-wrap gap-2">
            {product.designTypes.map((type, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg hover:shadow-md transition-all w-full md:w-auto"
        onClick={handleAddToCart}
      >
        Add to Cart
      </motion.button>
    </motion.div>
  );
}