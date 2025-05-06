"use client";
import { useState, useEffect } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import PopularCategories from "@/components/homepage/PopularCategories";
import Hero from "@/components/homepage/Hero";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import {bestsellers, getimage, newarrivals, reviewsData} from "@/lib/constants";


export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [bestFeature, setBestFeature] = useState<Product>({} as Product);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const newArrivalsResponse = await fetch(newarrivals);
        if (!newArrivalsResponse.ok) setError("Failed to fetch new arrivals");
        const newArrivalsData = await newArrivalsResponse.json();

        const bestSellersResponse = await fetch(bestsellers);
        if (!bestSellersResponse.ok) setError("Failed to fetch best sellers");
        const bestSellersData = await bestSellersResponse.json();

        const mapToProduct = (item: Product): Product => {
          const product: Product = {
            _id: item._id,
            name: item.name,
            gallery: [item.fileId],
            price: item.price,
            discountPercentage: item.discountPercentage || 0,
            rating: item.rating,
            fileId: item.fileId,
            createdAt: new Date().toISOString(),
            attributes: {
              size: [],
              color: []
            },
            category: undefined
          };
          
          return product;
        };

        setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData.map(mapToProduct) : []);
        const bestSellersMapped = Array.isArray(bestSellersData) ? bestSellersData.map(mapToProduct) : [];
        setBestSellers(bestSellersMapped);
        setBestFeature(bestSellersMapped[0] || null);
        setError(null); 
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error("Error fetching products:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  useEffect(() => {
    if (newArrivals.length > 0 || bestSellers.length > 0) {
      const fileIds = [
        ...newArrivals.map(product => product.fileId),
        ...bestSellers.map(product => product.fileId)
      ];
      
      fileIds.forEach(async (fileId) => {
        try {
          await fetch(getimage, {
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
          name="NEW ARRIVALS"
          data={newArrivals}
          viewAllLink="/shop"
          categoryColor="bg-amber-100"
        />
        <ProductListSec
          name="BEST SELLERS"
          data={bestSellers}
          viewAllLink="/shop"
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