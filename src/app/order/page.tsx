"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { 
  Package, 
  Truck, 
  Check, 
  AlertCircle, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Box, 
  CreditCard, 
  Calendar, 
  ShoppingBag,
  Tag,
  Palette
} from "lucide-react";
import { trackorder, getimage } from "@/lib/constants";
import axios from "axios";

// Updated interface to match your actual data structure
interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  _id: string;
  productDetails?: {
    name: string;
    price: number;
    fileId?: string;
  };
}

interface OrderDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

// Add image URL cache
const imageUrlCache = new Map<string, string>();

// Function to get or create image URL
const getImageUrl = async (fileId: string): Promise<string> => {
  if (imageUrlCache.has(fileId)) {
    return imageUrlCache.get(fileId)!;
  }

  try {
    const response = await axios.post(
      getimage,
      { file_id: fileId },
      { responseType: "blob" }
    );
    const url = URL.createObjectURL(response.data);
    imageUrlCache.set(fileId, url);
    return url;
  } catch (error) {
    console.error(`Failed to load image for fileId ${fileId}:`, error);
    return "";
  }
};

export default function OrderPage() {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAnimation, setSearchAnimation] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const handleTrackOrder = async () => {
    if (!orderId) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setSearchAnimation(true);

    try {
      const response = await fetch(trackorder, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) { 
        throw new Error("Failed to fetch order details. Please try again.");
      }

      const data = await response.json();
      setOrderDetails(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage); 
    } finally {
      setIsLoading(false);
      setTimeout(() => setSearchAnimation(false), 500);
    }
  };

  // Format date from MongoDB date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStage = () => {
    if (!orderDetails) return 0;
    
    switch(orderDetails.status) {
      case "delivered": return 4;
      case "shipped": return 3;
      case "processing": return 2;
      case "pending": return 1;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "text-green-600";
      case "shipped": return "text-blue-600";
      case "processing": return "text-yellow-600";
      case "pending": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // Load all images when order details are fetched
  useEffect(() => {
    if (orderDetails) {
      const loadImages = async () => {
        const urls: Record<string, string> = {};
        for (const item of orderDetails.items) {
          if (item.productDetails?.fileId) {
            const url = await getImageUrl(item.productDetails.fileId);
            if (url) {
              urls[item.productDetails.fileId] = url;
            }
          }
        }
        setImageUrls(urls);
      };
      loadImages();
    }

    // Cleanup function to revoke URLs when component unmounts
    return () => {
      Object.values(imageUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
      setImageUrls({});
    };
  }, [orderDetails]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="max-w-5xl mx-auto px-4 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute text-[10px] text-white/30"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                >
                  #
                </div>
              ))}
            </div>
            
            <div className="relative z-10">
              <h2 className={cn(
                integralCF.className,
                "text-3xl md:text-4xl font-bold mb-2"
              )}>
                TRACK YOUR ORDER
              </h2>
              <p className="text-white/70 max-w-md">
                Enter your order ID to track your package and get real-time updates on its journey to you.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full max-w-lg">
                <Input
                  type="text"
                  placeholder="Enter your Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="border-2 border-black/10 text-black h-14 pl-12 pr-4 rounded-xl focus:border-black transition-colors"
                />
                <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40" size={20} />
                
                <motion.div 
                  className="absolute inset-0 bg-black/5 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: searchAnimation ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              
              <Button
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="bg-black text-white rounded-xl px-8 py-3 h-14 text-base font-medium hover:bg-black/80 transition-colors flex-shrink-0 w-full md:w-auto"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2"
                  >
                    <Clock size={18} />
                  </motion.div>
                ) : (
                  <Truck size={18} className="mr-2" />
                )}
                {isLoading ? "Searching..." : "Track Order"}
              </Button>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center text-red-600 bg-red-50 px-4 py-3 rounded-lg"
              >
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Order Details */}
          {orderDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8"
            >
              {/* Order Summary Header */}
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-black">Order #{orderDetails._id}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-500" />
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(orderDetails.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                  <div className="px-4 py-1 rounded-full bg-gray-100 flex items-center">
                    <span className="text-sm font-medium">
                      Status: <span className={getStatusColor(orderDetails.status)}>{orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}</span>
                    </span>
                  </div>
                  <div className={cn(
                    "px-4 py-1 rounded-full flex items-center",
                    orderDetails.paymentStatus === "completed" ? "bg-green-50" : "bg-amber-50"
                  )}>
                    <span className="text-sm font-medium">
                      Payment: <span className={getPaymentStatusColor(orderDetails.paymentStatus)}>
                        {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                      </span>
                    </span>
                  </div>
                  <Button
                    onClick={() => window.location.href = '/order'}
                    className="bg-black text-white rounded-full px-4 py-1 text-sm font-medium hover:bg-black/80 transition-colors flex items-center gap-2"
                  >
                    <Truck size={16} />
                    Track Another Order
                  </Button>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-black mb-6">Shipping Status</h3>
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-black"
                      initial={{ width: 0 }}
                      animate={{ width: `${(getStatusStage() / 4) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  
                  {/* Status Steps */}
                  <div className="flex justify-between relative">
                    {[
                      { label: "Order Placed", icon: Package },
                      { label: "Processing", icon: Box },
                      { label: "Shipped", icon: Truck },
                      { label: "Delivered", icon: Check }
                    ].map((step, index) => {
                      const isActive = getStatusStage() >= index + 1;
                      const Icon = step.icon;
                      
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <motion.div 
                            className={cn(
                              "w-11 h-11 rounded-full flex items-center justify-center z-10",
                              isActive ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                            )}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isActive ? 1 : 0.8 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            <Icon size={20} />
                          </motion.div>
                          <span className={cn(
                            "text-sm mt-2 font-medium text-center",
                            isActive ? "text-black" : "text-gray-400"
                          )}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Order Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                  <h4 className="text-lg font-bold text-black mb-4 flex items-center">
                    <User size={18} className="mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{orderDetails.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{orderDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{orderDetails.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="font-medium">{orderDetails.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                  <h4 className="text-lg font-bold text-black mb-4 flex items-center">
                    <CreditCard size={18} className="mr-2" />
                    Payment Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-black mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium font-mono">{orderDetails._id}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-black mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium">₹{orderDetails.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-black mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className={cn(
                          "font-medium",
                          getPaymentStatusColor(orderDetails.paymentStatus)
                        )}>
                          {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-black mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{formatDate(orderDetails.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Order Items</h4>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div 
                      key={`order-${orderDetails._id}-item-${item._id}`}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.productDetails?.fileId && imageUrls[item.productDetails.fileId] ? (
                          <img
                            src={imageUrls[item.productDetails.fileId]}
                            alt={item.productDetails.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShoppingBag size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-black">
                              {item.productDetails?.name || `Product ${item.productId.slice(-6)}`}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Product ID: {item.productId.slice(-6)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Quantity: {item.quantity}</p>
                            {item.productDetails?.price && (
                              <p className="text-sm text-gray-600">
                                ₹{item.productDetails.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex gap-4">
                          {item.size && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Tag size={14} />
                              <span>Size: {item.size}</span>
                            </div>
                          )}
                          {item.color && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Palette size={14} />
                              <span>Color: {item.color}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-medium">{orderDetails.items.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{orderDetails.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`font-medium ${getPaymentStatusColor(orderDetails.paymentStatus)}`}>
                      {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium">{formatDate(orderDetails.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Empty State */}
          {!orderDetails && !isLoading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="py-16 px-8 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Track Your Package</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Enter your order ID above to see detailed information about your order status and delivery timeline.
              </p>
              <div className="w-full max-w-md p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600">
                  Your order ID format example:
                </p>
                <p className="font-mono text-black font-medium my-2">67ff359a6df6ff6377a3e9e0</p>
                <p className="text-sm text-gray-600">
                  You can find it in your order confirmation email or in your account orders section.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}