"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks/redux";
import { removeFromCart, updateQuantity } from "@/lib/features/carts/cartsSlice";
import { Trash2 } from "lucide-react";
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
  size: string;
  color: string;
  description: string;
  material: string;
  packageSize?: string;
  category?: string;
  gallery: string[];
  attributes: {
    size?: Array<{ value: string; price?: number; stock?: number }>;
    color?: Array<{ value: string; price?: number; stock?: number }>;
  };
  createdAt: string;
  updatedAt?: string;
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
    let isMounted = true;
    setImageLoading(true);
    setImageError(false);

    const fetchImageData = async () => {
      try {
        const response = await axios.post(
          getimage,
          { file_id: data.fileId },
          { responseType: "blob" }
        );
        if (!isMounted) return;

        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        setImageLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error(`Failed to load image for product ${data.id}:`, error);
        setImageLoading(false);
        setImageError(true);
      }
    };

    if (data.fileId && !imageUrl) {
      fetchImageData();
    }

    return () => {
      isMounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [data.fileId, data.id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = data.quantity + delta;

    if (newQuantity === 0) {
      dispatch(
        removeFromCart({ id: data.id, size: data.size, color: data.color })
      );
    } else if (newQuantity > 0) {
      dispatch(
        updateQuantity({
          id: data.id,
          size: data.size,
          color: data.color,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleRemove = () => {
    if (
      window.confirm("Are you sure you want to remove this item from your cart?")
    ) {
      dispatch(
        removeFromCart({ id: data.id, size: data.size, color: data.color })
      );
    }
  };

  const discountedPrice =
    data.discount > 0
      ? data.price * (1 - data.discount / 100)
      : data.price;

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-200">
      <div className="relative w-24 h-24 bg-[#F0EEED] rounded-md flex-shrink-0">
        {imageLoading ? (
          <div className="animate-pulse bg-gray-200 w-full h-full rounded-md" />
        ) : imageError ? (
          <div className="flex items-center justify-center h-full text-sm text-red-500 bg-gray-100 rounded-md">
            Image unavailable
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`product_image_${data.title}`}
            fill
            className="object-contain p-2"
            sizes="96px"
            priority
          />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-black truncate">{data.title}</h3>
        <div className="text-sm text-gray-600 space-y-1 mt-1">
          {data.size && <p>Size: {data.size}</p>}
          {data.color && <p>Color: {data.color}</p>}
          {data.material && <p>Material: {data.material}</p>}
          {data.rating && (
            <p>
              Rating: {data.rating.toFixed(1)} / 5
              <span className="ml-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={`rating_${data.id}_${i}`}
                    className={i < Math.floor(data.rating) ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-base font-bold text-black">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {data.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{data.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            className="border-gray-300 hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <span className="text-black w-8 text-center">{data.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            className="border-gray-300 hover:bg-gray-100"
            aria-label="Increase quantity"
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
        aria-label={`Remove ${data.title} from cart`}
      >
        <Trash2 size={16} />
        Remove
      </Button>
    </div>
  );
};

export default ProductCard;