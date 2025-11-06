"use client";

import { useMemo } from "react";
import Image from "next/image";
import { X, Heart } from "@workspace/ui/lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { BuyNowButton, AddToCartButton } from "./product-actions";
import productsData from "../data/productsData.json";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { useFavouritesStore } from "../lib/store/favourite";

interface Product {
  id: number;
  productId: string;
  name: string;
  price: string;
  currencyCode: string;
  platform?: string;
  image?: string;
  category?: string;
}

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const favourites = useFavouritesStore((state) => state.favourites);
  const removeFavourite = useFavouritesStore((state) => state.removeFavourite);

  // Filter products based on favorite IDs (can be either productId string or id number)
  const favoriteProducts = useMemo(() => {
    if (!favourites || favourites.length === 0) return [];

    const favoriteIds = favourites.map((id: string) => id.toString());
    return (productsData as Product[]).filter(
      (product) =>
        favoriteIds.includes(product.id.toString()) ||
        favoriteIds.includes(product.productId)
    );
  }, [favourites]);

  const removeFromFavorites = (product: Product) => {
    // Use numeric id if available, otherwise use productId
    const productIdToRemove = product.id?.toString() || product.productId;
    removeFavourite(productIdToRemove);

    // Trigger custom event to refresh UI
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-full ml-auto data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-md flex flex-col">
        <DrawerHeader className="flex-shrink-0 border-b border-border">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-lg font-semibold">
              Favorites
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-56px)]">
          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-12 text-center">
              <Heart className="mb-4 w-12 h-12 opacity-50 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Your favorites list is empty
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex gap-4 items-start">
                    {/* Product Image */}
                    <div className="overflow-hidden relative flex-shrink-0 w-20 h-20 rounded bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-full h-full text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.platform || product.category || "Digital"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {formatCurrency(
                          Number(product.price),
                          product.currencyCode
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {/* Remove from favorites button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 w-8 h-8"
                        aria-label="Remove from favorites"
                        onClick={() => removeFromFavorites(product)}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>

                      {/* Action Buttons */}
                      <div className="flex gap-2 items-center">
                        <AddToCartButton
                          productId={product.productId}
                          product={product}
                        />
                        <BuyNowButton productId={product.productId} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
