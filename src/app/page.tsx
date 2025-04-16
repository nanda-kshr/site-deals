"use client";
import { useState, useEffect } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import PopularCategories from "@/components/homepage/PopularCategories/PopularCategories";
import Hero from "@/components/homepage/Hero";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Alex K.",
    content:
      '"Finding clothes that align with my personal style used to be a challenge until I discovered SiteDeals.store. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.”',
    rating: 5,
    date: "August 14, 2023",
  },
  {
    id: 2,
    user: "Sarah M.",
    content:
      `"I'm blown away by the quality and style of the clothes I received from SiteDeals.store. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”`,
    rating: 5,
    date: "August 15, 2023",
  },
  {
    id: 3,
    user: "Ethan R.",
    content:
      `"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt."`,
    rating: 5,
    date: "August 16, 2023",
  },
  {
    id: 4,
    user: "Olivia P.",
    content:
      `"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out."`,
    rating: 5,
    date: "August 17, 2023",
  },
  {
    id: 5,
    user: "Liam K.",
    content:
      `"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion."`,
    rating: 5,
    date: "August 18, 2023",
  },
  {
    id: 6,
    user: "Samantha D.",
    content:
      `"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."`,
    rating: 5,
    date: "August 19, 2023",
  },
];

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
          createdAt: undefined,
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