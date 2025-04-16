"use client";
import { useState, useEffect } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import PopularCategories from "@/components/homepage/PopularCategories/PopularCategories";
import Hero from "@/components/homepage/Hero";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import {reviewsData} from "@/lib/constants";


export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [bestFeature, setBestFeature] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch new arrivals
        const newArrivalsResponse = await fetch("/api/v1/products/arrivals");
        if (!newArrivalsResponse.ok) throw new Error("Failed to fetch new arrivals");
        const newArrivalsData = await newArrivalsResponse.json();

        // Fetch best sellers
        const bestSellersResponse = await fetch("/api/v1/products/best-sellers");
        if (!bestSellersResponse.ok) throw new Error("Failed to fetch best sellers");
        const bestSellersData = await bestSellersResponse.json();

        interface ApiProduct {
          _id?: string;
          name: string;
          srcUrl: string;
          price: number;
          discount?: number;
          rating: number;
        }

        const mapToProduct = (item: ApiProduct, index: number): Product => ({
          id: item._id || `product-${index}`,
          title: item.name,
          srcUrl: item.srcUrl,
          gallery: [item.srcUrl],
          price: item.price,
          discount: item.discount || 0,
          rating: item.rating,
          createdAt: new Date().toISOString(),
          _id: item._id || `product-${index}`
        });

        setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData.map(mapToProduct) : []);
        const bestSellersMapped = Array.isArray(bestSellersData) ? bestSellersData.map(mapToProduct) : [];
        setBestSellers(bestSellersMapped);
        setBestFeature(bestSellersMapped[0] || null);
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-8">Error: {error}</div>;

  return (
    <>
      <Hero bestFeature={bestFeature} />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="NEW ARRIVALS"
          data={newArrivals}
          viewAllLink="/shop#new-arrivals"
          categoryColor="bg-amber-100"
        />
        <ProductListSec
          title="BEST SELLERS"
          data={bestSellers}
          viewAllLink="/shop#best-sellers"
          showBadge={true}
          categoryColor="bg-blue-100"
        />
        <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <PopularCategories />
        </div>
        <Reviews data={reviewsData} />
      </main>
    </>
  );
}