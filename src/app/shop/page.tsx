// app/shop/page.tsx

"use client";
import { useState, useEffect, useCallback } from "react";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Product } from "@/types/product.types";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("most-popular");
  const [category, setCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 9;
  const skip = (page - 1) * limit;

  const handleSearch = useCallback(() => {
    const query = new URLSearchParams({
      page: "1",
      ...(category && { category }),
      ...(searchQuery && { q: searchQuery }),
    }).toString();
    router.push(`/shop?${query}`, { scroll: false });
  }, [searchQuery, category, router]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (searchQuery) {
      timeout = setTimeout(handleSearch, 500);
    }
    return () => clearTimeout(timeout);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "/api/v1/products";
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: skip.toString(),
          ...(category && { category }),
        });

        if (searchQuery) {
          url = "/api/v1/products/search";
          params.set("q", searchQuery);
        }

        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();

        const productList = searchQuery
          ? Array.isArray(data)
            ? data
            : []
          : Array.isArray(data)
          ? data
          : data.products || data.items || [];
        const total = searchQuery
          ? productList.length
          : Number.isFinite(data.total)
          ? data.total
          : Number.isFinite(data.totalCount)
          ? data.totalCount
          : productList.length || 100;

        setTotalProducts(total);

        const mappedProducts: Product[] = productList
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any, index: number) => {
            try {
              return {
                id: item._id || item.id || `product-${index}`,
                title: item.name || item.title || "Unnamed Product",
                srcUrl:
                  item.srcUrl ||
                  item.image ||
                  item.thumbnail ||
                  "/images/placeholder.jpg",
                gallery: item.gallery || [item.srcUrl || "/images/placeholder.jpg"],
                price: parseFloat(item.price) || 0,
                discount: parseFloat(item.discountPercentage || item.discount) || 0,
                rating: parseFloat(item.rating) || 0,
                stock: item.stock != null ? parseInt(item.stock, 10) : undefined,
                designTypes: item.designTypes || [],
                description: item.description || "",
                createdAt: item.createdAt || new Date(),
              };
            } catch (mapError) {
              console.error(`Error mapping product ${index}:`, mapError, item);
              return null;
            }
          })
          .filter((p: Product): p is Product => p !== null);

        const sortedProducts = [...mappedProducts].sort((a, b) => {
          if (sort === "low-price") return a.price - b.price;
          if (sort === "high-price") return b.price - a.price;
          return b.rating - a.rating;
        });

        setProducts(sortedProducts);
      } catch (err: Error | unknown) {
        console.error("Fetch error:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [skip, sort, category, searchQuery]);

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat);
    setProducts([]);
    router.push(
      `/shop?page=1${cat ? `&category=${cat}` : ""}${
        searchQuery ? `&q=${searchQuery}` : ""
      }`,
      { scroll: false }
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

  const categories = [
    { name: "All", value: null },
    { name: "Electronics", value: "electronics" },
    { name: "Home & Kitchen", value: "home-kitchen" },
    { name: "Toys & Games", value: "toys-games" },
    { name: "Books & Media", value: "books-media" },
  ];

  return (
    <main className="pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />

        <div className="mb-6">
          <div className="relative max-w-md mx-[var(--content-margin)]">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-black/20 text-black placeholder-black/60"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                category === cat.value || (!category && !cat.value)
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-black/60 hover:bg-gray-200"
              )}
              aria-label={`Filter by ${cat.name}`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        <div className="flex md:space-x-5 items-start">
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <h1
                className={cn(
                  integralCF.className,
                  "font-bold text-2xl md:text-[32px] text-black"
                )}
              >
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : category
                  ? categories.find((c) => c.value === category)?.name
                  : "All Products"}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 lg:mt-0">
                <span className="text-sm md:text-base text-black/60">
                  Showing {products.length > 0 ? skip + 1 : 0}–
                  {Math.min(skip + limit, totalProducts)} of {totalProducts}{" "}
                  Products
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black/60">Sort by:</span>
                  <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="font-medium text-sm sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-popular">
                        Most Popular
                      </SelectItem>
                      <SelectItem value="low-price">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="high-price">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[300px] bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    setProducts([]);
                    router.refresh();
                  }}
                  className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-black/60">
                  {searchQuery
                    ? `No products found for "${searchQuery}".`
                    : "No products found. Try another category or adjust filters."}
                </p>
              </div>
            ) : (
              <motion.div
                id="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5"
              >
                {products.map((product) => (
                  <motion.div
                    key={typeof product.id === 'string' || typeof product.id === 'number' ? product.id : String(product.id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard data={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && !error && products.length > 0 && !searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8"
              >
                <Pagination className="justify-between">
                  <PaginationPrevious
                    href={
                      page > 1
                        ? `/shop?page=${page - 1}${
                            category ? `&category=${category}` : ""
                          }${searchQuery ? `&q=${searchQuery}` : ""}`
                        : "#"
                    }
                    className={cn(
                      "border border-black/10",
                      page === 1 && "opacity-50 cursor-not-allowed"
                    )}
                  />
                  <PaginationContent>
                    {Array.from(
                      { length: Math.min(totalPages, 5) },
                      (_, i) => i + 1
                    ).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href={`/shop?page=${p}${
                            category ? `&category=${category}` : ""
                          }${searchQuery ? `&q=${searchQuery}` : ""}`}
                          className={cn(
                            "text-black/50 font-medium text-sm",
                            page === p && "text-black bg-amber-100"
                          )}
                          isActive={page === p}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationLink
                          href={`/shop?page=${totalPages}${
                            category ? `&category=${category}` : ""
                          }${searchQuery ? `&q=${searchQuery}` : ""}`}
                          className="text-black/50 font-medium text-sm"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </PaginationContent>
                  <PaginationNext
                    href={
                      page < totalPages
                        ? `/shop?page=${page + 1}${
                            category ? `&category=${category}` : ""
                          }${searchQuery ? `&q=${searchQuery}` : ""}`
                        : "#"
                    }
                    className={cn(
                      "border border-black/10",
                      page === totalPages && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </Pagination>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}