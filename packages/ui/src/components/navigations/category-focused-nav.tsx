"use client";

import { useState } from "react";
import { ChevronDown, Search, ShoppingCart, User, Star } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";

export function CategoryFocusedNavigation() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    {
      name: "Electronics",
      subcategories: [
        "Smartphones",
        "Laptops",
        "Headphones",
        "Cameras",
        "Gaming",
      ],
    },
    {
      name: "Fashion",
      subcategories: [
        "Women's Clothing",
        "Men's Clothing",
        "Shoes",
        "Accessories",
        "Jewelry",
      ],
    },
    {
      name: "Home & Garden",
      subcategories: [
        "Furniture",
        "Decor",
        "Kitchen",
        "Bedding",
        "Garden Tools",
      ],
    },
    {
      name: "Sports",
      subcategories: [
        "Fitness",
        "Outdoor",
        "Team Sports",
        "Water Sports",
        "Winter Sports",
      ],
    },
  ];

  return (
    <div className="bg-background border-b border-border">
      {/* Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-full"></div>
            <span className="font-semibold text-xl">CategoryStore</span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="What are you looking for?"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-accent/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Button
                  variant="ghost"
                  className="h-12 px-6 rounded-none border-r border-border/50 last:border-r-0 font-medium"
                >
                  {category.name}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>

                {/* Dropdown */}
                {activeCategory === category.name && (
                  <div className="absolute top-full left-0 w-64 bg-background border border-border shadow-lg z-50">
                    <div className="p-4 space-y-2">
                      <div className="font-medium text-sm text-muted-foreground mb-3">
                        {category.name} Categories
                      </div>
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                      <div className="pt-2 border-t border-border mt-3">
                        <button className="text-sm font-medium text-primary hover:underline">
                          View All {category.name}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="ml-auto flex items-center gap-4 py-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Deals</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Sale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
