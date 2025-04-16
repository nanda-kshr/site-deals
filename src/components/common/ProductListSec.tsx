// @/components/common/ProductListSec.tsx
import React from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product.types";
import Link from "next/link";

type ProductListSecProps = {
  title: string;
  data: Product[];
  viewAllLink?: string;
  subtitle?: string;
  categoryColor?: string;
  showBadge?: boolean;
};

const ProductListSec = ({
  title,
  data,
  viewAllLink,
  subtitle,
  categoryColor = "bg-amber-100",
  showBadge = false,
}: ProductListSecProps) => {
  // Fallback product for padding
  const fallbackProduct: Product = {
    id: "fallback",
    title: "Coming Soon",
    srcUrl: "/images/placeholder.jpg",
    gallery: ["/images/placeholder.jpg"],
    price: 0,
    discount: 0,
    rating: 0,
    createdAt: undefined,
  };

  // Ensure exactly 4 products
  const displayedProducts = [...data.slice(0, 4), ...Array(4 - Math.min(data.length, 4)).fill(fallbackProduct)];


  return (
    <section className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ y: "20px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className={`h-4 w-4 rounded-full ${categoryColor}`}></div>
            <h2
              className={cn([
                integralCF.className,
                "text-xl md:text-2xl lg:text-[32px] capitalize",
              ])}
            >
              {title}
            </h2>
            {showBadge && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
          </motion.div>

          {subtitle && (
            <motion.p
              initial={{ y: "20px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm text-gray-600 mb-2"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {viewAllLink && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-1"
          >
            <Link
              href={viewAllLink}
              className="text-blue-600 hover:underline font-medium text-sm flex items-center"
              aria-label={`View all ${title} products`}
              >
                <div>

                View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
                </div>
              
            </Link>
          </motion.div>
        )}
      </div>
      {data.length === 0 && displayedProducts.every(p => p.id === "fallback") ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-8"
        >
          <p className="text-gray-600">No products available at the moment.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: "50px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {displayedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="relative">
              <ProductCard data={product} />
            </div>
          ))}
        </motion.div>
      )}
      {viewAllLink && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-8 sm:mt-6 text-center sm:hidden"
        >
          <Link
            href={viewAllLink}
            className="w-full inline-block sm:w-[218px] px-[54px] py-3 border rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white text-blue-600 transition-all font-medium text-sm border-blue-200"
            aria-label={`See more ${title} products`}
          >
            See More Products
          </Link>
        </motion.div>
      )}
    </section>
  );
};

export default ProductListSec;