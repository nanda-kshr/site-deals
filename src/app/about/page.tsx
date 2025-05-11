"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-frame mx-auto px-4 md:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      <main className="max-w-frame mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className={cn(integralCF.className, "text-3xl md:text-4xl lg:text-5xl mb-6")}>
            About SiteDeals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We are a team of dedicated sellers committed to bringing you the finest quality products.
            Our journey is just beginning, but our standards are set high.
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className={cn(integralCF.className, "text-2xl mb-4")}>Our Mission</h2>
            <p className="text-gray-600">
              To provide our customers with exceptional products that meet the highest standards of quality and reliability.
              We believe in building trust through transparency and consistent excellence.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className={cn(integralCF.className, "text-2xl mb-4")}>Our Promise</h2>
            <p className="text-gray-600">
              Every product we offer is carefully selected and thoroughly vetted to ensure it meets our strict quality criteria.
              We stand behind everything we sell.
            </p>
          </div>
        </motion.div>

        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className={cn(integralCF.className, "text-2xl md:text-3xl mb-8 text-center")}>
            Our Commitment to Quality
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Careful Selection",
                description: "Each product undergoes rigorous quality checks before being offered to our customers."
              },
              {
                title: "Customer Satisfaction",
                description: "We prioritize your satisfaction and are committed to providing excellent service."
              },
              {
                title: "Continuous Improvement",
                description: "We constantly strive to enhance our product selection and service quality."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className={cn(integralCF.className, "text-2xl md:text-3xl mb-4")}>
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about our products or services? We're here to help.
            Reach out to us and we'll get back to you as soon as possible.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </Link>
        </motion.div>
      </main>
    </div>
  );
} 