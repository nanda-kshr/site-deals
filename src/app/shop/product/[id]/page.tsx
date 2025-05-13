"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Rating from "@/components/ui/Rating";
import { notFound } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import axios from "axios";
import { getimage, getproduct } from "@/lib/constants";
import {
  ArrowLeft,
  Heart,
  ImageOff,
  ShoppingBag,
  ChevronDown,
  Check,
  Info,
  ChevronRight,
  Share2,
  ShieldCheck,
} from "lucide-react";
import AttributeSelector from './AttributeSelector';

interface AttributeItem {
  value: string;
  price: number;
  stock: number;
}

interface ProductAttributes {
  size: AttributeItem[];
  color: AttributeItem[];
}

interface Product {
  _id: { $oid: string };
  id: string;
  name: string;
  fileId: string;
  gallery: string[];
  description: string;
  discountPercentage: number;
  createdAt: string;
  updatedAt?: string;
  attributes: ProductAttributes;
  rating: number;
  price: number;
  material: string;
  packageSize: string;
  designTypes: string[];
  stock: number;
  category: string;
}

// Enhanced Product Skeleton with gradient animation
function ProductSkeleton() {
  return (
    <div className="max-w-frame mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl animate-pulse"></div>

        <div className="space-y-6">
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-1/2 animate-pulse"></div>
          <div className="h-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-1/4 animate-pulse"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Product Image Gallery Component
function ProductImageGallery({
  mainImageUrl,
  galleryImageUrls,
  imageLoading,
  imageError,
  productName,
}: {
  mainImageUrl: string;
  galleryImageUrls: { [key: string]: string };
  imageLoading: boolean;
  imageError: boolean;
  productName: string;
}) {
  const [activeImage, setActiveImage] = useState<string>(mainImageUrl);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle zoom effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    if (imageContainerRef.current) {
      imageContainerRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
    }
  };

  // Update active image when main image changes
  useEffect(() => {
    if (mainImageUrl) {
      setActiveImage(mainImageUrl);
    }
  }, [mainImageUrl]);

  // Gallery images including main image
  const allImages = [mainImageUrl, ...Object.values(galleryImageUrls)].filter(Boolean);
  if (imageLoading) {
    return (
      <div className="aspect-square w-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center">
        <ShoppingBag size={40} className="text-gray-200 animate-bounce" />
      </div>
    );
  }

  if (imageError || allImages.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-50 rounded-2xl flex flex-col items-center justify-center">
        <ImageOff size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">Image unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image with zoom effect */}
      <motion.div
        ref={imageContainerRef}
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm",
          isZoomed ? "cursor-zoom-out scale-125 z-10" : "cursor-zoom-in"
        )}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={activeImage}
              alt={`Product image of ${productName}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Image controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          >
            {isZoomed ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight size={18} />
              </motion.div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Thumbnail gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {allImages.map((imgUrl, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2",
                activeImage === imgUrl ? "border-black shadow-md" : "border-gray-200 hover:border-gray-400"
              )}
              onClick={() => setActiveImage(imgUrl)}
            >
              <Image
                src={imgUrl}
                alt={`Product thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              {activeImage === imgUrl && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-0.5">
                    <Check size={12} className="text-black" />
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced Product Details Component
function ProductDetails({
  product,
  handleAddToCart,
  isFavorite,
  toggleFavorite,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
}: {
  product: Product;
  handleAddToCart: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}) {
  const [isProductInfoExpanded, setIsProductInfoExpanded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const getPrice = () => {
    if (!product.attributes && !product.price) return 0;
    
    // Get the selected size price
    const selectedSizeItem = product.attributes?.size?.find(s => s.value === selectedSize);
    const sizePrice = selectedSizeItem?.price || 0;
    
    // Get the selected color price
    const selectedColorItem = product.attributes?.color?.find(c => c.value === selectedColor);
    const colorPrice = selectedColorItem?.price || 0;
    
    // Use the highest price among base price, size price, and color price
    return Math.max(product.price || 0, sizePrice || 0, colorPrice || 0);
  };

  const finalPrice = getPrice();
  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount ? finalPrice / (1 - product.discountPercentage / 100) : finalPrice;

  const isInStock = () => {
    if (!product) return false;
    
    // Get stock levels for selected attributes
    const selectedSizeItem = product.attributes?.size?.find(s => s.value === selectedSize);
    const selectedColorItem = product.attributes?.color?.find(c => c.value === selectedColor);
    
    // If both attributes are required, check both stocks
    if (product.attributes?.size?.length && product.attributes?.color?.length) {
      return (selectedSizeItem?.stock || 0) > 0 && (selectedColorItem?.stock || 0) > 0;
    }
    
    // If only size is required
    if (product.attributes?.size?.length) {
      return (selectedSizeItem?.stock || 0) > 0;
    }
    
    // If only color is required
    if (product.attributes?.color?.length) {
      return (selectedColorItem?.stock || 0) > 0;
    }
    
    return true;
  };

  const canAddToCart = 
    (!product.attributes?.size?.length || selectedSize) &&
    (!product.attributes?.color?.length || selectedColor) &&
    isInStock() &&
    !isAddingToCart;

  const handleAddToCartClick = async () => {
    if (!canAddToCart) return;
    
    setIsAddingToCart(true);
    try {
      await handleAddToCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Enhanced Product Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(integralCF.className, "text-2xl md:text-3xl lg:text-4xl text-black tracking-tight")}
          >
            {product.name}
          </motion.h1>
        </div>

        {/* Rating & Share */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Rating
              initialValue={product.rating || 0}
              allowFraction
              SVGclassName="inline-block"
              fillColor="#000000"
              emptyColor="#E5E5E5"
              size={20}
              readonly
            />
            <span className="text-black text-sm ml-3 font-medium">
              {(product.rating || 0).toFixed(1)} <span className="text-black/60">/5</span>
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-gray-600 flex items-center gap-1.5 hover:text-black"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Price Display */}
      <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">₹{finalPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-base line-through text-gray-500">₹{originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>

          {hasDiscount && (
            <div className="bg-red-500 text-white font-bold px-3 py-1 rounded-lg text-sm">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Product Information */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          className="w-full px-4 py-3.5 flex justify-between items-center text-left"
          onClick={() => setIsProductInfoExpanded(!isProductInfoExpanded)}
        >
          <h3 className="text-base font-semibold text-black">Product Details</h3>
          <motion.div animate={{ rotate: isProductInfoExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isProductInfoExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 pb-4 border-t border-gray-100 pt-2">
                <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Description:</span>
                    <span className="text-right max-w-[60%]">{product.description || "No description available"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Material:</span>
                    <span>{product.material || "Not specified"}</span>
                  </div>
                  {product.packageSize && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Package Size:</span>
                      <span>{product.packageSize} cm</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-900">Color:</span>
                    <span>{selectedColor || "Select a color"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Size Selector */}
      <AttributeSelector
        label="Select Size"
        items={product.attributes?.size}
        selectedValue={selectedSize}
        onChange={setSelectedSize}
      />

      {/* Color Selector */}
      <AttributeSelector
        label="Select Color"
        items={product.attributes?.color}
        selectedValue={selectedColor}
        onChange={setSelectedColor}
      />

      {/* Add to Cart Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={canAddToCart ? { scale: 1.01, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" } : {}}
          whileTap={canAddToCart ? { scale: 0.98 } : {}}
          className={cn(
            "w-full py-4 rounded-xl flex items-center justify-center gap-3 font-medium text-base transition-all duration-300",
            !canAddToCart
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : isAddingToCart
            ? "bg-gray-500 text-white"
              : "bg-black text-white shadow-lg shadow-black/10 hover:shadow-black/20"
          )}
        onClick={handleAddToCartClick}
          disabled={!canAddToCart}
        >
        {isAddingToCart ? (
            <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
            {!isInStock() ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </motion.button>

      {/* Selection Requirements Notice */}
      {!canAddToCart && isInStock() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100"
        >
          <Info size={16} />
          <span>
            Please select
            {!selectedSize && (product.attributes?.size?.length || 0) > 0 ? " a size" : ""}
            {!selectedSize &&
            !selectedColor &&
            (product.attributes?.size?.length || 0) > 0 &&
            (product.attributes?.color?.length || 0) > 0
              ? " and"
              : ""}
            {!selectedColor && (product.attributes?.color?.length || 0) > 0 ? " a color" : ""} before adding to cart
          </span>
        </motion.div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="mt-2 space-y-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={cn(
              "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 border-2 transition-all duration-300 font-medium",
              isFavorite ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            )}
          >
            <Heart size={18} className={isFavorite ? "fill-pink-600 text-pink-600" : ""} />
            <span className="text-sm">Wishlist</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-medium"
          >
            <ShieldCheck size={18} />
            <span className="text-sm">Secure Checkout</span>
          </motion.button>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [galleryImageUrls, setGalleryImageUrls] = useState<{ [key: string]: string }>({});
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(getproduct, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            return notFound();
          }
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (!isMounted) return;

        const mappedProduct: Product = {
          _id: data._id || { $oid: id },
          id: data.id || id,
          name: data.name || "Unnamed Product",
          fileId: data.fileId || "",
          gallery: data.gallery || [],
          description: data.description || "No description available",
          discountPercentage: data.discountPercentage || 0,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || undefined,
          attributes: {
            size: data.attributes?.size?.map((size: AttributeItem) => ({
              value: size.value,
              price: size.price,
              stock: size.stock
            })) || [],
            color: data.attributes?.color?.map((color: AttributeItem) => ({
              value: color.value,
              price: color.price,
              stock: color.stock
            })) || []
          },
          rating: data.rating || 3,
          price: data.price || 0,
          material: data.material || "Not specified",
          packageSize: data.packageSize?.toString() || undefined,
          designTypes: data.designTypes || [],
          stock: data.stock || 0,
          category: data.category || "",
        };

        setProduct(mappedProduct);

        // Fetch images only after product is set
        if (mappedProduct.fileId || (mappedProduct.gallery && mappedProduct.gallery.length > 0)) {
          fetchAllImages(mappedProduct);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const fetchImageData = async (fileId: string) => {
      if (!fileId) return null;

      try {
        console.log(`Fetching image for fileId: ${fileId}`);
        const response = await axios.post(
          getimage,
          {
            file_id: fileId,
          },
          {
            responseType: "blob",
          }
        );

        if (response.data.size === 0) {
          console.error("Received empty blob for fileId:", fileId);
          return null;
        }

        const url = URL.createObjectURL(response.data);
        console.log(`Created URL for fileId ${fileId}:`, url);
        return url;
      } catch (error) {
        console.error(`Failed to load image for fileId ${fileId}:`, error);
        return null;
      }
    };

    const fetchAllImages = async (productData: Product) => {
      if (!productData) return;

      setImageLoading(true);
      setImageError(false);

      try {
        // Fetch main image
        if (productData.fileId) {
          console.log("Fetching main image with fileId:", productData.fileId);
          const mainUrl = await fetchImageData(productData.fileId);
          if (mainUrl && isMounted) {
            console.log("Setting main image URL:", mainUrl);
            setMainImageUrl(mainUrl);
          } else {
            console.warn("No valid main image URL was returned");
          }
        }

        // Fetch gallery images if there are any
        if (productData.gallery && productData.gallery.length > 0) {
          console.log("Fetching gallery images:", productData.gallery);
          const galleryPromises = productData.gallery.map(async (galleryId) => {
            const url = await fetchImageData(galleryId);
            return { id: galleryId, url };
          });

          const galleryResults = await Promise.all(galleryPromises);

          const newGalleryUrls = galleryResults.reduce((acc, { id, url }) => {
            if (url) acc[id] = url;
            return acc;
          }, {} as { [key: string]: string });

          if (isMounted) {
            console.log("Setting gallery URLs:", newGalleryUrls);
            setGalleryImageUrls(newGalleryUrls);
          }
        }
      } catch (err) {
        console.error("Error in fetchAllImages:", err);
        if (isMounted) setImageError(true);
      } finally {
        if (isMounted) setImageLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
      // Clean up object URLs to prevent memory leaks
      if (mainImageUrl) URL.revokeObjectURL(mainImageUrl);
      Object.values(galleryImageUrls).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    // Validate required selections
    if (product.attributes?.size?.length && !selectedSize) {
      setError("Please select a size");
      return;
    }
    if (product.attributes?.color?.length && !selectedColor) {
      setError("Please select a color");
      return;
    }

    // Calculate the correct price based on selections
    const sizePrice = product.attributes?.size?.find(s => s.value === selectedSize)?.price || 0;
    const colorPrice = product.attributes?.color?.find(c => c.value === selectedColor)?.price || 0;
    const basePrice = product.price || Math.max(sizePrice, colorPrice);

    try {
      // Ensure we have a valid product ID
      const productId = product._id?.$oid || product.id;
      if (!productId) {
        setError("Invalid product ID");
        return;
      }

      dispatch(
        addToCart({
          id: productId,
          title: product.name,
          fileId: product.fileId || "",
          price: basePrice,
          quantity: 1,
          discount: product.discountPercentage || 0,
          rating: product.rating || 0,
          size: selectedSize || "",
          color: selectedColor || "",
          description: product.description || "",
          material: product.material || "",
          packageSize: product.packageSize?.toString() || undefined,
          category: product.category || "",
          gallery: product.gallery || [],
          attributes: product.attributes || { size: [], color: [] },
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || undefined,
        })
      );

      setError(null);
    } catch {
      setError("Failed to add item to cart. Please try again.");
    }
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-frame mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border-2 border-red-100 rounded-xl p-8 max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 text-xl mb-6">{error || "Product not found"}</p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Enhanced Navigation with Product Name */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-frame mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Shop
          </Link>

          <h2 className={cn(integralCF.className, "text-sm md:text-base truncate max-w-[200px] text-center")}>
            {product.name}
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              isFavorite ? "text-pink-500" : "text-gray-400 hover:text-gray-700"
            )}
          >
            <Heart size={18} className={isFavorite ? "fill-pink-500" : ""} />
          </motion.button>
        </div>
      </div>

      <div className="max-w-frame mx-auto px-4 md:px-6 py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16"
        >
          {/* Enhanced Product Image Gallery */}
          <div className="md:sticky md:top-24 self-start">
            <ProductImageGallery
              mainImageUrl={mainImageUrl}
              galleryImageUrls={galleryImageUrls}
              imageLoading={imageLoading}
              imageError={imageError}
              productName={product.name}
            />
          </div>

          {/* Product Details Section */}
          <ProductDetails
            product={product}
            handleAddToCart={handleAddToCart}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "All transactions are encrypted" },
              { icon: <ShoppingBag size={24} />, title: "Fast Shipping", desc: "2-3 business days" },
              { icon: <Info size={24} />, title: "24/7 Support", desc: "Customer service team" },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50">
                <div className="mb-2 text-gray-700">{badge.icon}</div>
                <h3 className="font-medium text-sm mb-1">{badge.title}</h3>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbars while preserving functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}