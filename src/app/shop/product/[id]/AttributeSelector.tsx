import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AttributeItem {
  value: string;
  price: number;
  stock: number;
}

interface AttributeSelectorProps {
  label: string;
  items?: AttributeItem[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
}

export default function AttributeSelector({
  label,
  items = [],
  selectedValue,
  onChange,
}: AttributeSelectorProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selectedValue === item.value;
          const isOutOfStock = item.stock <= 0;

          return (
            <motion.button
              key={item.value}
              whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
              onClick={() => !isOutOfStock && onChange(isSelected ? null : item.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-black text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
              )}
              disabled={isOutOfStock}
            >
              <div className="flex flex-col items-center">
                <span>{item.value}</span>
                <span className="text-xs mt-1">
                  {isOutOfStock ? (
                    "Out of Stock"
                  ) : (
                    <>₹{item.price.toFixed(2)}</>
                  )}
                </span>
                {!isOutOfStock && (
                  <span className="text-xs text-gray-500">
                    Stock: {item.stock}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 