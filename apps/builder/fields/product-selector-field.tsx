"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Search, X, Filter, Grid, List } from "@workspace/ui/lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";

// Import data files (in production, these would be API calls)
import productsData from "../data/productsData.json";
import brandsData from "../data/brands.json";
import categoriesData from "../data/categories.json";
import productTypesData from "../data/productTypes.json";

interface Product {
  id: number;
  productId: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  price: string;
  currencyCode: string;
  image: string;
}

interface ProductSelectorFieldProps {
  value: {
    selectionMode: "manual" | "filter";
    selectedProducts: Product[];
    filters: {
      category?: string;
      productType?: string;
      brand?: string;
    };
    maxProducts: number;
  };
  onChange: (value: any) => void;
  label: string;
}

export function ProductSelectorField({
  value,
  onChange,
  label,
}: ProductSelectorFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState<
    "category" | "productType" | "brand"
  >("category");

  // Convert data to Product interface
  const allProducts: Product[] = useMemo(() => {
    return productsData.map((product) => ({
      id: product.id,
      productId: product.productId,
      name: product.name,
      brand: product.brand,
      type: product.type,
      category: product.category,
      price: product.price,
      currencyCode: product.currencyCode,
      image: product.image,
    }));
  }, []);

  // Filter products based on search and current filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category/productType/brand filters if in filter mode
    if (value.selectionMode === "filter") {
      if (value.filters.category) {
        filtered = filtered.filter(
          (product) => product.category === value.filters.category
        );
      }
      if (value.filters.productType) {
        filtered = filtered.filter(
          (product) => product.type === value.filters.productType
        );
      }
      if (value.filters.brand) {
        filtered = filtered.filter(
          (product) => product.brand === value.filters.brand
        );
      }
    }

    return filtered;
  }, [allProducts, searchTerm, value.selectionMode, value.filters]);

  // Get filter options
  const getFilterOptions = (type: "category" | "productType" | "brand") => {
    switch (type) {
      case "category":
        return categoriesData.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));
      case "productType":
        return productTypesData.map((type) => ({
          value: type.name,
          label: type.label,
        }));
      case "brand":
        return brandsData.map((brand) => ({
          value: brand.value,
          label: brand.label,
        }));
      default:
        return [];
    }
  };

  const handleProductToggle = (product: Product) => {
    const isSelected = value.selectedProducts.some((p) => p.id === product.id);
    let newSelectedProducts;

    if (isSelected) {
      newSelectedProducts = value.selectedProducts.filter(
        (p) => p.id !== product.id
      );
    } else {
      if (value.selectedProducts.length >= value.maxProducts) {
        return; // Don't add if max reached
      }
      newSelectedProducts = [...value.selectedProducts, product];
    }

    onChange({
      ...value,
      selectedProducts: newSelectedProducts,
    });
  };

  const handleFilterChange = (
    filterType: "category" | "productType" | "brand",
    filterValue: string
  ) => {
    const newFilters = {
      ...value.filters,
      [filterType]: filterValue === "all" ? undefined : filterValue,
    };

    // Auto-select products when filter changes
    let autoSelectedProducts: Product[] = [];
    if (filterValue !== "all") {
      const filtered = allProducts.filter((product) => {
        if (filterType === "category") return product.category === filterValue;
        if (filterType === "productType") return product.type === filterValue;
        if (filterType === "brand") return product.brand === filterValue;
        return false;
      });
      autoSelectedProducts = filtered.slice(0, value.maxProducts);
    }

    onChange({
      ...value,
      selectionMode: "filter",
      filters: newFilters,
      selectedProducts: autoSelectedProducts,
    });
  };

  const handleModeChange = (mode: "manual" | "filter") => {
    onChange({
      ...value,
      selectionMode: mode,
      selectedProducts: mode === "filter" ? [] : value.selectedProducts,
    });
  };

  const removeProduct = (productId: number) => {
    const newSelectedProducts = value.selectedProducts.filter(
      (p) => p.id !== productId
    );
    onChange({
      ...value,
      selectedProducts: newSelectedProducts,
    });
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>

      {/* Selection Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={value.selectionMode === "manual" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("manual")}
        >
          Manual Selection
        </Button>
        <Button
          variant={value.selectionMode === "filter" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("filter")}
        >
          Filter by Category/Type/Brand
        </Button>
      </div>

      {/* Selected Products Display */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Selected Products ({value.selectedProducts.length}/
            {value.maxProducts})
          </span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Search className="mr-2 w-4 h-4" />
                {value.selectionMode === "manual"
                  ? "Select Products"
                  : "Change Filter"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>
                  {value.selectionMode === "manual"
                    ? "Select Products"
                    : "Filter Products"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Search and View Controls */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    {viewMode === "grid" ? (
                      <List className="w-4 h-4" />
                    ) : (
                      <Grid className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Filter Controls (only in filter mode) */}
                {value.selectionMode === "filter" && (
                  <div className="flex gap-2">
                    <Select
                      value={selectedFilter}
                      onValueChange={(value: any) => setSelectedFilter(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="productType">
                          Product Type
                        </SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={value.filters[selectedFilter] || "all"}
                      onValueChange={(filterValue) =>
                        handleFilterChange(selectedFilter, filterValue)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={`Select ${selectedFilter}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All {selectedFilter}s
                        </SelectItem>
                        {getFilterOptions(selectedFilter).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                {/* Products List */}
                <ScrollArea className="h-96">
                  {value.selectionMode === "manual" ? (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-2 gap-4"
                          : "space-y-2"
                      }
                    >
                      {filteredProducts.map((product) => {
                        const isSelected = value.selectedProducts.some(
                          (p) => p.id === product.id
                        );
                        const isDisabled =
                          !isSelected &&
                          value.selectedProducts.length >= value.maxProducts;

                        return (
                          <Card
                            key={product.id}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? "border-2 border-primary" : ""
                            } ${isDisabled ? "opacity-50" : ""}`}
                            onClick={() =>
                              !isDisabled && handleProductToggle(product)
                            }
                          >
                            <CardContent className="p-3">
                              <div className="flex gap-3">
                                <div className="relative flex-shrink-0 w-12 h-12">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium truncate">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Brand: {product.brand}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Category: {product.category}
                                  </p>
                                  <p className="text-sm font-medium">
                                    {product.currencyCode} {product.price}
                                  </p>
                                </div>
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  className="mt-1"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredProducts
                        .slice(0, value.maxProducts)
                        .map((product) => (
                          <Card
                            key={product.id}
                            className="border-2 border-primary"
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div className="flex gap-3">
                                  <div className="relative flex-shrink-0 w-12 h-12">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <h4 className="text-sm font-medium truncate">
                                      {product.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      Brand: {product.brand}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Category: {product.category}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {product.currencyCode} {product.price}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Selected Products */}
        <div className="flex flex-wrap gap-2">
          {value.selectedProducts.map((product) => (
            <Badge
              key={product.id}
              variant="secondary"
              className="flex gap-1 items-center"
            >
              <div className="relative w-4 h-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <span className="text-xs">{product.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-4 h-4 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeProduct(product.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
