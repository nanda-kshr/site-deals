"use client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import ResTopNavbar from "./ResTopNavbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/redux";
import { Menu, Search, Truck } from "lucide-react";

const data: NavMenu = [
  {
    id: 1,
    type: "MenuItem",
    label: "On Sale",
    url: "/shop",
    children: [],
  },{
    id: 2,
    type: "MenuItem",
    label: "Contact Us",
    url: "/contact",
    children: [],
  },
];

const CartBtn = () => {
  const router = useRouter();
  const { items = [] } = useAppSelector((state) => state.carts || { items: [] }); // Safeguard for undefined state
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <button
      onClick={() => router.push("/cart")}
      className="p-1 relative"
    >
      <Image
        priority
        src="/icons/cart.svg"
        height={100}
        width={100}
        alt="cart"
        className="max-w-[22px] max-h-[22px]"
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};

const TopNavbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get the search query from URL parameters on component mount and when URL changes
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      // Close mobile search after submission
      if (isSearchOpen) {
        setIsSearchOpen(false);
      }
    }
  };

  return (
    <nav className="sticky top-0 bg-white z-20 shadow-sm">
      <div className="flex relative max-w-frame mx-[var(--content-margin)] items-center justify-between py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          {/* Hamburger menu for mobile - Now with explicit Menu icon */}
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data}>
              <Menu size={24} className="text-black" />
            </ResTopNavbar>
          </div>
          
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-2xl lg:text-[32px] mb-2 mr-3 lg:mr-10",
            ])}
          >
            SiteDeals
          </Link>
          <NavigationMenu className="hidden md:flex mr-6">
            <NavigationMenuList>
              {data.map((item) => (

                <React.Fragment key={item.id}>

                  {item.type === "MenuItem" && (
                    <MenuItem label={item.label} url={String(item.url)} />
                  )}


                  {item.type === "MenuList" && (
                    <MenuList data={item.children} label={item.label} />
                  )}
                </React.Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-4 pr-14 border border-black/20 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-4 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        <div className="flex items-center">
          {/* Search Icon - Mobile */}
          <button 
            className="md:hidden p-1 mr-4"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <Search size={22} />
          </button>

          {/* Track Order Button */}
          <Link 
            href="/order"
            className="hidden md:flex items-center gap-2 mr-4 text-black hover:text-black/80 transition-colors"
          >
            <Truck size={18} />
            <span className="text-sm font-medium">Track Order</span>
          </Link>
          
          <CartBtn />
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4 bg-white border-t border-black/10">
          <form onSubmit={handleSearch} className="w-full relative">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-4 pr-14 border border-black/20 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              autoFocus
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-4 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;