"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, Heart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";

export function StickyCartNavigation() {
  const [cartItems] = useState(3);
  const [wishlistItems] = useState(7);

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top Bar */}
      <div className="bg-accent/50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Free shipping on orders over $75
            </p>
            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Track Order
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Help
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-full"></div>
            <span className="font-semibold text-xl">Store</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="w-5 h-5" />
              {wishlistItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {wishlistItems}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {cartItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center gap-8 mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="font-medium">
            New Arrivals
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            Women
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            Men
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            Kids
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            Accessories
          </Button>
          <Button variant="ghost" size="sm" className="font-medium">
            Sale
          </Button>
        </div>
      </div>
    </div>
  );
}
