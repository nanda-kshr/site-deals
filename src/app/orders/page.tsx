"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { motion } from "framer-motion";
import { Check, Clock, Package, Truck } from "lucide-react";

interface OrderItem {
  productId: { $oid: string };
  quantity: number;
  size: string;
  color: string;
  _id: { $oid: string };
}

interface Order {
  _id: { $oid: string };
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="text-amber-500" />;
      case "shipped":
        return <Truck className="text-blue-500" />;
      case "delivered":
        return <Check className="text-green-500" />;
      default:
        return <Package className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-frame mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={`skeleton-${i}`} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-frame mx-auto px-4 py-8">
      <h1 className={cn(integralCF.className, "text-3xl font-bold mb-8")}>Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={`order-${order._id.$oid}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order._id.$oid.slice(-6)}</h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt.$date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div 
                      key={`order-${order._id.$oid}-item-${item._id.$oid}`}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">Product ID: {item.productId.$oid.slice(-6)}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Size: {item.size}</span>
                          <span>Color: {item.color}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <span className={`text-sm font-medium ${
                    order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 