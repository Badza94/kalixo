"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "@workspace/ui/lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import productsData from "../data/productsData.json";
import { formatCurrency } from "@workspace/ui/lib/utils";

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

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get top 3 best selling products (using first 3 for now)
  const bestSellingProducts = (productsData as Product[]).slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex gap-2 items-center p-4 border-b border-border">
            <Search className="flex-shrink-0 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Best Selling Section */}
          <div className="p-4">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Best selling
            </h3>
            <div className="space-y-3">
              {bestSellingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 items-center p-3 rounded-lg transition-colors cursor-pointer hover:bg-accent/50"
                >
                  {/* Product Image */}
                  <div className="overflow-hidden relative flex-shrink-0 w-16 h-16 rounded bg-muted">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.platform || product.category || "Digital"}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-sm font-medium text-foreground">
                    {formatCurrency(
                      Number(product.price),
                      product.currencyCode
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
