"use client";

import { Button } from "@workspace/ui/components/button";

interface BuyNowButtonProps {
  productId: string;
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
}

// Default buy now handler
const buyNow = (id: string) => {
  console.log("Buy Now clicked for product:", id);
  // Your buy now logic here
};

export function BuyNowButton({
  productId,
  onClick = buyNow,
  variant = "default",
  size = "sm",
  backgroundColor,
  textColor,
  className = "",
}: BuyNowButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => onClick(productId)}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      className={`hover:cursor-pointer ${className}`}
    >
      Buy Now
    </Button>
  );
}
