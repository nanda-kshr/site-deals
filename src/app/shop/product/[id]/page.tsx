"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // Corrected import
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Rating from "@/components/ui/Rating";
import { Product } from "@/types/product.types";
import { notFound } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { ArrowLeft, Heart, ImageOff, Share2, ShoppingBag, Truck } from "lucide-react";
import axios from "axios";

// Define ProductSkeleton locally
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

// Define ProductImageGallery locally
function ProductImageGallery({
  product,
  selectedImageUrl,
  setSelectedImageUrl,
  imageUrls,
  imageError,
}: {
  product: Product;
  selectedImageUrl: string | null;
  setSelectedImageUrl: (url: string | null) => void;
  imageUrls: { fileId: string; url: string | null; attribute?: { key: string; value: string } }[];
  imageError: boolean;
}) {
  useEffect(() => {
    const fetchAdditionalImages = async () => {
      const allFileIds = [
        product.fileId,
        ...product.gallery,
        ...(product.attributes?.size?.map((item) => item.fileId) || []),
        ...(product.attributes?.color?.map((item) => item.fileId) || []),
      ].filter(Boolean) as string[];
      const newImagePromises = allFileIds
        .filter((fileId) => !imageUrls.some((img) => img.fileId === fileId))
        .map(async (fileId) => {
          try {
            const imageResponse = await axios.post(
              "/api/v1/image",
              { file_id: fileId },
              { responseType: "blob" }
            );
            let attribute = undefined;
            if (product.attributes) {
              for (const [key, items] of Object.entries(product.attributes)) {
                const item = items.find((i) => i.fileId === fileId);
                if (item) {
                  attribute = { key, value: item.value };
                  break;
                }
              }
            }
            return { fileId, url: URL.createObjectURL(imageResponse.data), attribute };
          } catch (error) {
            console.error(`Failed to load gallery image ${fileId}:`, error);
            return { fileId, url: null, attribute: undefined };
          }
        });
      const newUrls = await Promise.all(newImagePromises);
      setImageUrls((prev) => [...prev, ...newUrls]);
    };

    if (
      product.gallery.length > 0 ||
      (product.attributes?.size.length || 0) > 0 ||
      (product.attributes?.color.length || 0) > 0
    ) {
      fetchAdditionalImages();
    }
  }, [product.gallery, product.attributes, imageUrls]);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] bg-[#F9F9F9] rounded-xl overflow-hidden"
      >
        {!selectedImageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <ShoppingBag size={24} className="text-gray-400 animate-pulse" />
          </div>
        ) : imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <ImageOff size={28} className="text-red-400" />
          </div>
        ) : (
          <Image
            src={selectedImageUrl}
            alt={`${product.title} main product image`}
            fill
            className="object-contain p-6"
            priority
            sizes="(max-size: 768px) 100vw, 50vw"
          />
        )}
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
      {imageUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex gap-3 overflow-x-auto pb-2 snap-x"
        >
          {imageUrls.map((img, index) => (
            <motion.button
              key={index}
              onClick={() => img.url && setSelectedImageUrl(img.url)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative min-w-20 w-20 h-20 rounded-lg overflow-hidden border-2 snap-start transition-all duration-200",
                selectedImageUrl === img.url ? "border-black shadow-md" : "border-gray-200 hover:border-gray-300"
              )}
              title={img.attribute ? `${img.attribute.key}: ${img.attribute.value}` : "Main Gallery"}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={`${product.title} view ${index + 1} ${img.attribute ? `(${img.attribute.key}: ${img.attribute.value})` : ""}`}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <ImageOff size={16} className="text-gray-400" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Define ProductDetails locally
function ProductDetails({
  product,
  handleAddToCart,
  quantity,
  incrementQuantity,
  decrementQuantity,
  isFavorite,
  toggleFavorite,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
}: {
  product: Product;
  handleAddToCart: () => void;
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}) {
  const getPrice = () => {
    if (!product.attributes && !product.price) return 0;
    const sizePrice = product.attributes?.size.find((s) => s.value === selectedSize)?.price || 0;
    const colorPrice = product.attributes?.color.find((c) => c.value === selectedColor)?.price || 0;
    return product.price || Math.max(sizePrice, colorPrice); // Use global price if available, otherwise attribute price
  };

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

      <div className="flex items-center gap-3 mb-6">
        <span className="font-bold text-3xl text-black">
          ${getPrice().toFixed(2)}
        </span>
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

      {/* Size Selection */}
      {product.attributes?.size.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-black mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.attributes.size.map((size, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "text-sm border-2 px-4 py-2 rounded-lg transition-colors duration-200",
                  selectedSize === size.value ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"
                )}
                onClick={() => setSelectedSize(size.value)}
              >
                {size.value}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.attributes?.color.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-black mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.attributes.color.map((color, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "text-sm border-2 px-4 py-2 rounded-lg transition-colors duration-200",
                  selectedColor === color.value ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"
                )}
                onClick={() => setSelectedColor(color.value)}
              >
                {color.value}
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
          className={cn(
            "bg-black text-white px-6 py-3.5 rounded-lg flex-1 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300",
            (!selectedSize || !selectedColor) && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleAddToCart}
          disabled={!selectedSize || !selectedColor}
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ fileId: string; url: string | null; attribute?: { key: string; value: string } }[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: params.id }),
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
          fileId: data.fileId,
          gallery: data.gallery || [],
          description: data.description,
          createdAt: data.createdAt || new Date().toISOString(),
          _id: "",
          attributes: data.attributes || { size: [], color: [] },
          rating: data.rating || 0,
          price: data.price || 0, // Include price from API
        };

        setProduct(mappedProduct);
        // Fetch all image URLs (main fileId, galleries, and attribute photos)
        const allFileIds = [
          mappedProduct.fileId,
          ...mappedProduct.gallery,
          ...(mappedProduct.attributes?.size?.map((item) => item.fileId) || []),
          ...(mappedProduct.attributes?.color?.map((item) => item.fileId) || []),
        ].filter(Boolean) as string[];
        const imagePromises = allFileIds.map(async (fileId) => {
          try {
            const imageResponse = await axios.post(
              "/api/v1/image",
              { file_id: fileId },
              { responseType: "blob" }
            );
            return { fileId, url: URL.createObjectURL(imageResponse.data) };
          } catch (error) {
            console.error(`Failed to load image ${fileId}:`, error);
            return { fileId, url: null };
          }
        });
        const urls = await Promise.all(imagePromises);
        setImageUrls(urls);
        // Set the first valid URL as the selected image
        const firstValidUrl = urls.find((img) => img.url)?.url;
        if (firstValidUrl) setSelectedImageUrl(firstValidUrl);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
        setImageLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    // Cleanup object URLs on unmount or when imageUrls change
    return () => {
      imageUrls.forEach((img) => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
    };
  }, [imageUrls]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    const price = product.price || // Use global price if available
      (product.attributes?.size.find((s) => s.value === selectedSize)?.price ||
        product.attributes?.color.find((c) => c.value === selectedColor)?.price ||
        0);
    dispatch(
      addToCart({
        id: String(product.id),
        title: product.title,
        fileId: product.fileId,
        price: price,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      })
    );
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  if (loading || imageLoading) {
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
            selectedImageUrl={selectedImageUrl}
            setSelectedImageUrl={setSelectedImageUrl}
            imageUrls={imageUrls}
            imageError={imageError}
          />

          {/* Details Section */}
          <ProductDetails
            product={product}
            handleAddToCart={handleAddToCart}
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </motion.div>
      </div>
    </div>
  );
}