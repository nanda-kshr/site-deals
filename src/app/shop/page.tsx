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
import { Filter, ShoppingBag } from "lucide-react";
import { categories, getproducts, placeholderImage, searchproducts } from "@/lib/constants";

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
  const [showFilters, setShowFilters] = useState(false);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 9;
  const skip = (page - 1) * limit;

  const query = searchParams.get("q");
  useEffect(() => {
    if (query !== null) {
      setSearchQuery(query);
    } else if (searchQuery && !searchParams.has("q")) {
      setSearchQuery("");
    }
  }, [query, searchParams, searchQuery]);


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
        let url = getproducts;
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: skip.toString(),
          ...(category && { category }),
        });

        if (searchQuery) {
          url = searchproducts;
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
          .map((item: Product, index: number) => {
            try {
              return {
                _id: item._id,
                title: item.name,
                fileId:
                  item.fileId,
                gallery: item.gallery || [placeholderImage],
                price: item.price,
                discount: item.discountPercentage,
                rating: item.rating,
                stock: 10,
                attributes: item.attributes || {
                  size: [],
                  color: [],
                },
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

  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-frame mx-[var(--content-margin)] px-4 xl:px-0 pt-6">
        <BreadcrumbShop />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <hr className="h-[1px] border-t border-black/10 my-5" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            integralCF.className,
            "text-2xl md:text-3xl text-black mb-6 md:mb-8"
          )}
        >
          {searchQuery
            ? searchQuery
            : category
            ? categories.find((c) => c.value === category)?.name.toUpperCase()
            : "SHOP COLLECTION"}
        </motion.h1>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="relative w-full sm:max-w-md">
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-black/20 rounded-md hover:border-black transition-colors"
            >
              <Filter size={16} />
              Filters
            </button>
            
            <div className="relative z-10 w-full sm:w-auto">
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="border border-black/20 font-medium text-sm w-full sm:w-[180px] bg-white text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-black/20">
                  <SelectItem value="most-popular">Most Popular</SelectItem>
                  <SelectItem value="low-price">Price: Low to High</SelectItem>
                  <SelectItem value="high-price">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showFilters ? 1 : 0, y: showFilters ? 0 : -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "overflow-hidden transition-all duration-300",
            showFilters ? "max-h-96 mb-6" : "max-h-0 mb-0"
          )}
        >
          <div className="py-4 border-y border-black/10">
            <h3 className="text-sm font-semibold text-black mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    category === cat.value || (!category && !cat.value)
                      ? "bg-black text-white"
                      : "bg-white text-black border border-black/20 hover:border-black"
                  )}
                  aria-label={`Filter by ${cat.name}`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Product Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-between items-center mb-6"
        >
          <span className="text-sm text-black/60">
            Showing {products.length > 0 ? skip + 1 : 0}–
            {Math.min(skip + limit, totalProducts)} of {totalProducts} Products
          </span>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="rounded-md overflow-hidden border border-black/10"
              >
                <div className="h-[250px] bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                  <div className="h-8 bg-gray-100 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 border border-black/10 rounded-md"
          >
            <p className="text-red-600 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLoading(true);
                setError(null);
                setProducts([]);
                router.refresh();
              }}
              className="px-6 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-black/80 transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-black/10 rounded-md"
          >
            <ShoppingBag size={48} className="mx-auto mb-4 text-black/30" />
            <p className="text-black/60 mb-4">
              {searchQuery
                ? `No products found for "${searchQuery}".`
                : "No products found in this category."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery("");
                handleCategoryChange(null);
              }}
              className="px-6 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-black/80 transition-colors"
            >
              View All Products
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            id="products"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
          >
            {products.map((product, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
              >
                <ProductCard data={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-10 mb-16"
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      page > 1
                        ? `/shop?page=${page - 1}${
                            category ? `&category=${category}` : ""
                          }${searchQuery ? `&q=${searchQuery}` : ""}`
                        : "#"
                    }
                    className={cn(
                      "border border-black/20 hover:border-black transition-colors",
                      page === 1 && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                  />
                </PaginationItem>
                
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
                        "border font-medium",
                        page === p 
                          ? "border-black bg-black text-white" 
                          : "border-black/20 text-black hover:border-black"
                      )}
                      isActive={page === p}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <span className="px-2">...</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href={`/shop?page=${totalPages}${
                          category ? `&category=${category}` : ""
                        }${searchQuery ? `&q=${searchQuery}` : ""}`}
                        className="border border-black/20 text-black hover:border-black"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext
                    href={
                      page < totalPages
                        ? `/shop?page=${page + 1}${
                            category ? `&category=${category}` : ""
                          }${searchQuery ? `&q=${searchQuery}` : ""}`
                        : "#"
                    }
                    className={cn(
                      "border border-black/20 hover:border-black transition-colors",
                      page === totalPages && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </div>
    </main>
  );
}