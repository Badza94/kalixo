"use client";

import { useState } from "react";
import {
  ChevronRight,
  Home,
  Search,
  ShoppingCart,
  User,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";

export function BreadcrumbNavigation() {
  const [currentPath] = useState([
    { name: "Home", href: "/" },
    { name: "Electronics", href: "/electronics" },
    { name: "Smartphones", href: "/electronics/smartphones" },
    { name: "iPhone", href: "/electronics/smartphones/iphone" },
  ]);

  return (
    <div className="bg-background">
      {/* Top Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded-full"></div>
              <span className="font-semibold">BreadcrumbStore</span>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 py-2" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs"
                >
                  1
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="font-medium">
                Categories
              </Button>
              <Button variant="ghost" size="sm">
                New Arrivals
              </Button>
              <Button variant="ghost" size="sm">
                Best Sellers
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Deals
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Free shipping over $50</span>
              <span>•</span>
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-accent/20 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            {currentPath.map((item, index) => (
              <div key={item.name} className="flex items-center">
                {index === 0 ? (
                  <Home className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
                )}
                <button
                  className={`hover:text-foreground transition-colors ${
                    index === currentPath.length - 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Sub-navigation for current category */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                iPhone Models:
              </span>
              <Button variant="ghost" size="sm" className="text-sm">
                iPhone 15
              </Button>
              <Button variant="ghost" size="sm" className="text-sm">
                iPhone 14
              </Button>
              <Button variant="ghost" size="sm" className="text-sm">
                iPhone 13
              </Button>
              <Button variant="ghost" size="sm" className="text-sm">
                iPhone SE
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-sm"
            >
              Sort by Price
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
