"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useCartStore } from "../../lib/store/cart";

interface Product {
  id: number;
  productId: string;
  name: string;
  price: string;
  currencyCode?: string;
  image?: string;
  countryCode?: string;
  brand?: string;
  category?: string;
  platform?: string;
  type?: string;
}

interface AddToCartButtonProps {
  productId: string;
  product?: Product;
  onClick?: (productId: string) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "input"
    | "text";
  size?: "default" | "sm" | "lg" | "icon";
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  onAddToCart?: () => void;
}

export function AddToCartButton({
  productId,
  product,
  onClick,
  variant = "ghost",
  size = "sm",
  backgroundColor,
  textColor,
  className = "",
  onAddToCart,
}: AddToCartButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  // Check if product is in cart (use numeric id if available, otherwise use productId)
  const idToCheck = product?.id || productId;
  // Subscribe to cart array to ensure reactivity when cart changes
  const inCart = useCartStore((state) =>
    state.cart.some((item) => item.id === Number(idToCheck))
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = () => {
    if (onClick) {
      onClick(productId);
      return;
    }

    if (!product) {
      console.error("Product data is required to add to cart");
      return;
    }

    // Convert price to cents (cartPrice)
    const cartPrice = Math.round((parseFloat(product.price) || 0) * 100);

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        countryCode: product.countryCode,
        brand: product.brand,
        currencyCode: product.currencyCode,
        category: product.category,
        platform: product.platform,
        type: product.type,
      },
      cartPrice,
      1
    );

    // Trigger custom event to refresh cart UI
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    onAddToCart?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      className={`flex-shrink-0 hover:cursor-pointer ${className}`}
      aria-label={isMounted && inCart ? "Item in cart" : "Add to cart"}
    >
      <ShoppingBag
        className={`w-4 h-4 ${isMounted && inCart ? "stroke-primary" : ""}`}
      />
    </Button>
  );
}
