import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React from "react";
import * as motion from "framer-motion/client";
import CategoryCard from "./CategoryCard";
import { LucideIcon } from "lucide-react"; 
import { Monitor, Utensils, ToyBrick, Book } from "lucide-react";

type Category = {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
  accentColor: string;
};

const PopularCategories = () => {
  

  const categories: Category[] = [
    {
      title: "Electronics",
      description: "Latest tech & gadgets",
      url: "/shop",
      icon: Monitor,
      accentColor: "from-blue-500/20",
    },
    {
      title: "Home & Kitchen",
      description: "Essentials for your space",
      url: "/shop",
      icon: Utensils,
      accentColor: "from-green-500/20",
    },
    {
      title: "Toys & Games",
      description: "For all ages",
      url: "/shop",
      icon: ToyBrick,
      accentColor: "from-purple-500/20",
    },
    {
      title: "Books & Media",
      description: "Bestsellers & new releases",
      url: "/shop",
      icon: Book,
      accentColor: "from-amber-500/20",
    },
  ];

  return (
    <div className="px-4 xl:px-0 py-6">
      <section className="max-w-frame mx-[var(--content-margin)] bg-white border border-gray-100 shadow-sm px-4 py-8 md:px-8 md:py-10 rounded-xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
          <motion.div
            initial={{ y: "30px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2
              className={cn([
                integralCF.className,
                "text-2xl md:text-3xl capitalize",
              ])}
            >
              Explore Popular Categories
            </h2>
            <p className="text-gray-600 text-sm mt-1 md:mt-2">
              Find exactly what you need from our curated selections
            </p>
          </motion.div>

          {/* View All Categories Link */}
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            href="/categories"
            className="hidden sm:flex items-center text-blue-600 hover:underline text-sm font-medium mt-2 sm:mt-0"
          >
            View all categories
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
          </motion.a>
        </div>

        {/* Categories Grid */}
        <motion.div
          initial={{ y: "50px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              description={category.description}
              url={category.url}
              icon={category.icon}
              accentColor={category.accentColor}
            />
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: "30px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
        >
          {[
            "Best Sellers",
            "New Releases",
            "Today's Deals",
            "Customer Favorites",
            "Top Rated",
            "Trending Now",
          ].map((quickLink, index) => (
            <a
              key={index}
              href={`/browse/${quickLink.toLowerCase().replace(/\s+/g, "-")}`}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-3 px-3 text-center text-sm font-medium transition-colors"
            >
              {quickLink}
            </a>
          ))}
        </motion.div>

        {/* Mobile View All Categories Button */}
        <motion.a
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.3 }}
          href="/categories"
          className="mt-8 block text-center w-full py-3 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 sm:hidden"
        >
          View all categories
        </motion.a>
      </section>
    </div>
  );
};

export default PopularCategories;