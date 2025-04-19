"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks/redux";
import { removeFromCart, updateQuantity } from "@/lib/features/carts/cartsSlice";
import { Trash2 } from "lucide-react"; // Import an icon
import axios from "axios";
import { getimage } from "@/lib/constants";
import { useEffect, useState } from "react";

interface CartProduct {
  id: string;
  title: string;
  fileId: string;
  price: number;
  discount: number;
  rating: number;
  quantity: number;
}

interface ProductCardProps {
  data: CartProduct;
}

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);

    const fetchImageData = async () => {
      try {
        const response = await axios.post(
          getimage,
          {
            file_id: data.fileId,
          },
          {
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        setImageLoading(false);
      } catch (error) {
        console.error(`Failed to load image for product ${data.id}:`, error);
        setImageLoading(false);
        setImageError(true);
      }
    };

    if (data.fileId && !imageUrl) {
      fetchImageData();
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [data.fileId]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = data.quantity + delta;

    // If quantity would become zero, remove item completely
    if (newQuantity === 0) {
      dispatch(removeFromCart(data.id));
    } else if (newQuantity > 0) {
      dispatch(updateQuantity({ id: data.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    // Optional: add confirmation
    if (
      window.confirm("Are you sure you want to remove this item from your cart?")
    ) {
      dispatch(removeFromCart(data.id));
    }
  };

  const discountedPrice =
    data.discount > 0
      ? data.price * (1 - data.discount / 100)
      : data.price;

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-20 h-20 bg-[#F0EEED] rounded-md">
        {imageLoading ? (
          <div className="animate-pulse bg-gray-200 w-full h-full rounded-md" />
        ) : imageError ? (
          <div className="flex items-center justify-center h-full text-sm text-red-500">
            Image unavailable
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`product_image_${data.title}`}
            fill
            className="object-contain p-2"
            sizes="80px"
            priority
          />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-black truncate">{data.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-black">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {data.discount > 0 && (
            <span className="text-sm text-black/40 line-through">
              ₹{data.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            className="border-black/20"
          >
            -
          </Button>
          <span className="text-black">{data.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            className="border-black/20"
          >
            +
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="text-red-600 hover:text-red-800 flex items-center gap-1"
      >
        <Trash2 size={16} />
        Remove
      </Button>
    </div>
  );
};

export default ProductCard;