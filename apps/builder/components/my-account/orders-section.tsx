"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import {
  MoreVertical,
  ChevronDown,
  Copy,
  Check,
  ShoppingCart,
} from "@workspace/ui/lucide-react";
import { useState } from "react";
import productsData from "@/data/productsData.json";
import Link from "next/link";
import Image from "next/image";

type OrderStatus = "completed" | "pending_payment" | "failed";

interface OrderProduct {
  productId: number;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  products: OrderProduct[];
  subtotal: number;
  walletUsed: number;
  discount: number;
  total: number;
  code?: string;
}

export function OrdersSection() {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([
    "FH-00134133",
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Generate sample orders using productsData
  const orders: Order[] = [
    {
      id: "FH-00134133",
      date: "September 1, 2025",
      status: "completed",
      products: [{ productId: 17056, quantity: 1, priceAtPurchase: 100.0 }],
      subtotal: 100.0,
      walletUsed: 10,
      discount: 5,
      total: 100.0,
      code: "56Q08-CWXY5-71A34-68B44-3WE18",
    },
    {
      id: "FH-00134132",
      date: "August 28, 2025",
      status: "pending_payment",
      products: [{ productId: 17057, quantity: 2, priceAtPurchase: 100.0 }],
      subtotal: 200.0,
      walletUsed: 50.0,
      discount: 10.0,
      total: 140.0,
    },
    {
      id: "FH-00134131",
      date: "August 15, 2025",
      status: "failed",
      products: [
        { productId: 17058, quantity: 1, priceAtPurchase: 100.0 },
        { productId: 17059, quantity: 1, priceAtPurchase: 100.0 },
      ],
      subtotal: 200.0,
      walletUsed: 0,
      discount: 20.0,
      total: 180.0,
    },
    {
      id: "FH-00134130",
      date: "August 10, 2025",
      status: "completed",
      products: [{ productId: 17060, quantity: 3, priceAtPurchase: 100.0 }],
      subtotal: 300.0,
      walletUsed: 100.0,
      discount: 30.0,
      total: 170.0,
      code: "A1B2C-D3E4F-G5H6I-J7K8L-M9N0P",
    },
  ];

  const getProductById = (id: number) => {
    return productsData.find((p) => p.id === id);
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return {
          variant: "default" as const,
          className:
            "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
          label: "Completed",
        };
      case "pending_payment":
        return {
          variant: "default" as const,
          className:
            "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
          label: "Pending Payment",
        };
      case "failed":
        return {
          variant: "destructive" as const,
          className: "",
          label: "Failed",
        };
      default:
        return {
          variant: "secondary" as const,
          className: "",
          label: status,
        };
    }
  };

  const handleBuyAgain = (order: Order) => {
    // Add products to cart and redirect to checkout
    console.log("Buy again:", order.products);
    // TODO: Implement cart functionality
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Order History</h2>
        <p className="mt-2 text-muted-foreground">
          View your digital game code purchases.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrders.includes(order.id);
          const statusStyles = getStatusStyles(order.status);

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                {/* Order Header */}
                <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-center">
                    <h3 className="text-xl font-bold">Order #{order.id}</h3>
                    <span className="text-sm text-muted-foreground">
                      {order.date}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge
                      variant={statusStyles.variant}
                      className={statusStyles.className}
                    >
                      {statusStyles.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                      <span className="sr-only">Toggle order details</span>
                    </Button>
                  </div>
                </div>

                {/* Order Details - Collapsible */}
                {isExpanded && (
                  <div className="pt-6 space-y-6 border-t">
                    {order.products.map((orderProduct, index) => {
                      const product = getProductById(orderProduct.productId);
                      if (!product) return null;

                      return (
                        <div key={index} className="space-y-4">
                          {/* Product Info */}
                          <div className="flex gap-4 items-start">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="object-cover w-20 h-20 rounded-lg border"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold truncate">
                                {product.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {product.productId}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-5 h-5" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex gap-8 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Price
                              </span>{" "}
                              <span className="font-medium">
                                {product.currencyCode === "GBP"
                                  ? "£"
                                  : product.currencyCode === "EUR"
                                    ? "€"
                                    : "$"}
                                {orderProduct.priceAtPurchase.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Qty</span>{" "}
                              <span className="font-medium">
                                {orderProduct.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Code Display - Only for completed orders */}
                          {order.status === "completed" && order.code && (
                            <div className="flex flex-col gap-3 items-stretch p-1 rounded-lg border sm:flex-row sm:items-center bg-muted">
                              <div className="flex flex-1 gap-3 items-center px-4 py-3">
                                <code className="flex-1 font-mono text-sm tracking-wider sm:text-base">
                                  {order.code}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8"
                                  onClick={() => copyToClipboard(order.code!)}
                                >
                                  {copiedCode === order.code ? (
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                  <span className="sr-only">Copy code</span>
                                </Button>
                              </div>
                              <Button asChild>
                                <Link href="#">REDEEM CODE</Link>
                              </Button>
                            </div>
                          )}

                          {/* Pending/Failed status message */}
                          {order.status === "pending_payment" && (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                              <div className="flex-1 px-4 py-3 text-sm font-medium text-yellow-600 rounded-md border bg-yellow-500/10 dark:text-yellow-400 border-yellow-500/20">
                                Payment pending - Please complete your payment
                              </div>
                              <Button
                                variant="outline"
                                className="self-stretch h-auto"
                              >
                                Complete Payment
                              </Button>
                            </div>
                          )}

                          {order.status === "failed" && (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                              <div className="flex-1 px-4 py-3 text-sm font-medium rounded-md border bg-destructive/10 text-destructive border-destructive/20">
                                Payment failed - Please try again or contact
                                support
                              </div>
                              <Button
                                variant="outline"
                                className="self-stretch h-auto"
                              >
                                Contact Support
                              </Button>
                            </div>
                          )}

                          {index < order.products.length - 1 && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      );
                    })}

                    {/* Order Totals */}
                    <div className="pt-6 space-y-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>£{order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.walletUsed > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Wallet</span>
                          <span className="text-green-600 dark:text-green-400">
                            -£{order.walletUsed.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Discount
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            -£{order.discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>£{order.total.toFixed(2)}</span>
                      </div>

                      {/* Buy Again Button - Only for completed orders */}
                      {order.status === "completed" && (
                        <div className="pt-4">
                          <Button
                            className="w-full sm:w-auto"
                            onClick={() => handleBuyAgain(order)}
                          >
                            <ShoppingCart className="mr-2 w-4 h-4" />
                            Buy Again
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
