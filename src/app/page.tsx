"use client";
import { useState, useEffect } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import PopularCategories from "@/components/homepage/PopularCategories/PopularCategories";
import Hero from "@/components/homepage/Hero";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import {reviewsData} from "@/lib/constants";

// Current user information constants

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [bestFeature, setBestFeature] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Add parameters to the fetch URLs

        // Fetch new arrivals with user and timestamp parameters
        const newArrivalsResponse = await fetch(`/api/v1/products/arrivals`);
        if (!newArrivalsResponse.ok) throw new Error("Failed to fetch new arrivals");
        const newArrivalsData = await newArrivalsResponse.json();

        // Fetch best sellers with user and timestamp parameters
        const bestSellersResponse = await fetch(`/api/v1/products/best-sellers`);
        if (!bestSellersResponse.ok) throw new Error("Failed to fetch best sellers");
        const bestSellersData = await bestSellersResponse.json();

        interface ApiProduct {
          _id?: string;
          name: string;
          fileId: string;
          price: number;
          discount?: number;
          rating: number;
        }

        const mapToProduct = (item: ApiProduct, index: number): Product => {
          // Create a product with all required fields
          const product: Product = {
            id: item._id || `product-${index}`,
            title: item.name,
            fileId: item.fileId,
            gallery: [item.fileId],
            price: item.price,
            discount: item.discount || 0,
            rating: item.rating,
            createdAt: new Date().toISOString(),
            _id: item._id || `product-${index}`
          };
          
          return product;
        };

        setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData.map(mapToProduct) : []);
        const bestSellersMapped = Array.isArray(bestSellersData) ? bestSellersData.map(mapToProduct) : [];
        setBestSellers(bestSellersMapped);
        setBestFeature(bestSellersMapped[0] || null);
        
        // Log successful data fetching with user info for analytics
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        
        // Log errors with user info for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Additional effect to load user fileIds if needed
  useEffect(() => {
    if (newArrivals.length > 0 || bestSellers.length > 0) {
      // Get all fileIds from products
      const fileIds = [
        ...newArrivals.map(product => product.fileId),
        ...bestSellers.map(product => product.fileId)
      ];
      
      // Fetch each file with user and timestamp data
      fileIds.forEach(async (fileId) => {
        try {
          await fetch('/api/telegram/getFile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file_id: fileId
            })
          });
        } catch (error) {
          console.error(`Error fetching file ${fileId}:`, error);
        }
      });
    }
  }, [newArrivals, bestSellers]);

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