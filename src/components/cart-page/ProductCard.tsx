"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks/redux";
import { removeFromCart, updateQuantity } from "@/lib/features/carts/cartsSlice";
import { Trash2 } from "lucide-react"; // Import an icon

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
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
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
        <Image
          src={data.fileId}
          fill
          alt={data.title}
          className="object-contain p-2"
          priority
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-black truncate">
          {data.title}
        </h3>
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