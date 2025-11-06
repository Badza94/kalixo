"use client";

import { useState, useEffect } from "react";
import { Heart } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useFavouritesStore } from "../../lib/store/favourite";

interface WishlistButtonProps {
  productId: string;
  product?: {
    id: number;
    productId: string;
  };
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
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export function WishlistButton({
  productId,
  product,
  onClick,
  variant = "ghost",
  size = "sm",
  backgroundColor,
  textColor,
  className = "",
  onToggleFavorite,
}: WishlistButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const addFavourite = useFavouritesStore((state) => state.addFavourite);
  const removeFavourite = useFavouritesStore((state) => state.removeFavourite);
  const isFavourite = useFavouritesStore((state) => state.isFavourite);

  // Use numeric id if available, otherwise use productId
  const idToUse = product?.id?.toString() || productId;
  const isFavorited = isFavourite(idToUse);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleFavorite = () => {
    if (onClick) {
      onClick(productId);
      return;
    }

    if (isFavorited) {
      removeFavourite(idToUse);
    } else {
      addFavourite(idToUse);
    }

    // Trigger custom event to refresh UI
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    onToggleFavorite?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      className={`flex-shrink-0 hover:cursor-pointer ${className}`}
      aria-label={
        isMounted && isFavorited ? "Remove from favorites" : "Add to favorites"
      }
    >
      <Heart
        className={`w-4 h-4 ${isMounted && isFavorited ? "fill-current" : ""}`}
      />
    </Button>
  );
}
