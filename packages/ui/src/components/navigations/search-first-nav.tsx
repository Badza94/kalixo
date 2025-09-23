"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  User,
  Mic,
  Camera,
  TrendingUp,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";

export function SearchFirstNavigation() {
  const [searchFocused, setSearchFocused] = useState(false);

  const trendingSearches = [
    "wireless headphones",
    "summer dresses",
    "gaming laptop",
    "coffee maker",
    "running shoes",
  ];

  const recentSearches = ["bluetooth speaker", "yoga mat", "kitchen knives"];

  return (
    <div className="bg-background border-b border-border">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-full"></div>
            <span className="font-semibold text-xl">SearchMart</span>
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-3xl relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for products, brands, and more..."
                className="pl-12 pr-24 py-3 text-lg border-2 focus:border-primary"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="sm" className="p-2">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Camera className="w-4 h-4" />
                </Button>
                <Button size="sm" className="px-4">
                  Search
                </Button>
              </div>
            </div>

            {/* Search Suggestions */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 bg-background border border-border shadow-lg z-50 mt-1 rounded-md">
                <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Trending Searches
                    </div>
                    <div className="space-y-1">
                      {trendingSearches.map((search) => (
                        <button
                          key={search}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Recent Searches
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                4
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="bg-accent/20 border-t border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="font-medium">
                All Categories
              </Button>
              <Button variant="ghost" size="sm">
                Electronics
              </Button>
              <Button variant="ghost" size="sm">
                Fashion
              </Button>
              <Button variant="ghost" size="sm">
                Home
              </Button>
              <Button variant="ghost" size="sm">
                Sports
              </Button>
              <Button variant="ghost" size="sm">
                Books
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
