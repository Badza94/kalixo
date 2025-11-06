"use client";

import { useState } from "react";
import { Heart } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { WishlistDrawer } from "../wishlist-drawer";
import { useFavouritesStore } from "../../lib/store/favourite";

interface WishlistActionProps {
  textColor?: string;
  backgroundColor?: string;
}

export function WishlistAction({
  textColor,
  backgroundColor,
}: WishlistActionProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const favourites = useFavouritesStore((state) => state.favourites);
  const favoritesCount = favourites.length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsDrawerOpen(true)}
        style={{
          color: textColor,
          backgroundColor: backgroundColor,
        }}
      >
        <Heart
          className={`w-4 h-4 ${favoritesCount > 0 ? "fill-current" : ""}`}
        />
      </Button>
      <WishlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
