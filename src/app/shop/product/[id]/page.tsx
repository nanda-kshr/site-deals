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
import { ArrowLeft, Heart, Share2, ShoppingBag, Truck } from "lucide-react";

export default function ProductPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
        quantity: quantity,
      })
    );

    // Show toast notification
    // You can implement a toast notification system here
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

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
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="max-w-frame mx-auto px-4 md:px-6 pt-4 md:pt-6">
        <Link 
          href="/shop" 
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Shop
        </Link>
      </div>

      <div className="max-w-frame mx-auto px-4 md:px-6 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16"
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
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Component for loading state
function ProductSkeleton() {
  return (
    <div className="max-w-frame mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div>
          <div className="h-[400px] md:h-[500px] bg-gray-200 rounded-xl mb-4"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-14 bg-gray-200 rounded w-full"></div>
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
        className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] bg-[#F9F9F9] rounded-xl overflow-hidden"
      >
        <Image
          src={selectedImage}
          fill
          alt={product.title}
          className="object-contain p-6"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <Share2 size={18} className="text-black" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Gallery Thumbnails */}
      {product.gallery && product.gallery.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex gap-3 overflow-x-auto pb-2 snap-x"
        >
          {[product.srcUrl, ...product.gallery].map((img, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedImage(img)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative min-w-20 w-20 h-20 rounded-lg overflow-hidden border-2 snap-start transition-all duration-200",
                selectedImage === img ? "border-black shadow-md" : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={img}
                fill
                alt={`${product.title} view ${index + 1}`}
                className="object-contain p-1"
                sizes="80px"
              />
            </motion.button>
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
  handleAddToCart,
  quantity,
  incrementQuantity,
  decrementQuantity,
  isFavorite,
  toggleFavorite
}: { 
  product: Product; 
  discountedPrice: number; 
  handleAddToCart: () => void;
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col"
    >
      <h1 className={cn(integralCF.className, "text-2xl md:text-3xl lg:text-4xl text-black mb-3")}>
        {product.title}
      </h1>
      
      <div className="flex items-center mb-4">
        <Rating
          initialValue={product.rating}
          allowFraction
          SVGclassName="inline-block"
          fillColor="#000000"
          emptyColor="#E5E5E5"
          size={20}
          readonly
        />
        <span className="text-black text-sm ml-3 font-medium">
          {product.rating.toFixed(1)} <span className="text-black/60">/5</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <span className="font-bold text-3xl text-black">
          ${discountedPrice.toFixed(2)}
        </span>
        {product.discount > 0 && (
          <>
            <span className="font-bold text-black/40 line-through text-xl">
              ${product.price.toFixed(2)}
            </span>
            <span className="font-medium text-xs py-1.5 px-3.5 rounded-full bg-black text-white">
              SAVE {product.discount}%
            </span>
          </>
        )}
      </div>
      
      <p className="text-black/80 text-sm md:text-base mb-6 leading-relaxed">
        {product.description}
      </p>
      
      {product.designTypes && product.designTypes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-black mb-3">Design Options</h3>
          <div className="flex flex-wrap gap-2">
            {product.designTypes.map((type, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm border-2 border-black bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-black mb-3">Quantity</h3>
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={decrementQuantity}
            className="w-10 h-10 border-2 border-black rounded-l-lg flex items-center justify-center bg-white text-black hover:bg-black hover:text-white transition-colors"
          >
            -
          </motion.button>
          <div className="w-16 h-10 border-t-2 border-b-2 border-black flex items-center justify-center bg-white text-black font-medium">
            {quantity}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={incrementQuantity}
            className="w-10 h-10 border-2 border-black rounded-r-lg flex items-center justify-center bg-white text-black hover:bg-black hover:text-white transition-colors"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Shipping & Returns */}
      <div className="mb-6 bg-[#F9F9F9] p-4 rounded-lg">
        <div className="flex items-start gap-3 mb-2">
          <Truck size={18} className="text-black mt-0.5" />
          <div>
            <p className="text-sm font-medium text-black">Free Shipping</p>
            <p className="text-xs text-black/70">Orders over $50 qualify for free shipping</p>
          </div>
        </div>
        <div className="w-full h-px bg-gray-200 my-2"></div>
        <p className="text-xs text-black/70">30-day easy returns</p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-black text-white px-6 py-3.5 rounded-lg flex-1 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={18} />
          Add to Cart
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFavorite}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300",
            isFavorite 
              ? "bg-black text-white border-black" 
              : "bg-white text-black border-black hover:bg-black hover:text-white"
          )}
        >
          <Heart size={20} className={isFavorite ? "fill-white" : ""} />
        </motion.button>
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-xs text-black/70 flex items-center gap-2"
      >
        <div className="flex -space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
          ))}
        </div>
        <span>120+ customers have bought this item today</span>
      </motion.div>
    </motion.div>
  );
}