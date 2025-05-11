import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React from "react";
import * as motion from "framer-motion/client";

const Hero = () => {
  return (
    <header className="bg-white pt-6 md:pt-10 overflow-hidden">
      <div className="relative md:max-w-frame mx-[var(--content-margin)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative px-6 py-14 md:py-20 mb-8 md:mb-12 rounded-none md:rounded-lg bg-black text-white"
        >
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="flex flex-col justify-center max-w-2xl mx-auto text-center">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6"
              >
                <span className="inline-block h-[1px] w-16 bg-white/40 mb-8"></span>
                <h1 className={cn([
                  integralCF.className,
                  "text-4xl md:text-5xl lg:text-6xl mb-6",
                ])}>
                  REFINED ESSENTIALS
                </h1>
                <span className="inline-block h-[1px] w-16 bg-white/40 mt-2"></span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-white/80 text-sm md:text-base mb-8 lg:mb-10 max-w-lg mx-auto"
              >
                Timeless pieces designed for the modern individual. Carefully curated 
                with a focus on quality, functionality, and understated elegance.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-wrap gap-3 justify-center"
              >
                <Link
                  href="/shop"
                  className="group bg-white hover:bg-gray-100 transition-all text-black px-8 py-3 rounded-none"
                >
                  <span className="flex items-center gap-2">
                    Shop Collection
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transform transition-transform group-hover:translate-x-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-none transition-all"
                >
                  Our Story
                </Link>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.03 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute -right-20 top-1/2 transform -translate-y-1/2 w-80 h-80 md:w-96 md:h-96"
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.5,-61.2C62.6,-55.1,76.5,-42.8,81.9,-27.4C87.3,-12,84.2,6.4,77.7,23.1C71.2,39.9,61.4,54.9,47.3,63.1C33.2,71.2,14.8,72.5,-2.9,76.3C-20.6,80.1,-37.6,86.4,-50.8,80.4C-64,74.5,-73.5,56.2,-79.2,37.5C-85,18.9,-87.1,-0.1,-81.5,-15.9C-75.9,-31.6,-62.6,-44.1,-48,-50.4C-33.4,-56.7,-17.5,-56.9,-1.2,-55.3C15.1,-53.7,32.4,-67.3,47.5,-61.2Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mx-4 mb-16 md:mb-20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-b border-gray-200 py-8">
            <div className="mb-6 md:mb-0">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Our principles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-center md:text-left">
              <div>
                <div className="font-medium mb-1">Quality Materials</div>
                <div className="text-xs text-gray-500">Built to last</div>
              </div>
              <div>
                <div className="font-medium mb-1">Timeless Design</div>
                <div className="text-xs text-gray-500">Beyond trends</div>
              </div>
              <div>
                <div className="font-medium mb-1">Ethical Standards</div>
                <div className="text-xs text-gray-500">Transparent process</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;