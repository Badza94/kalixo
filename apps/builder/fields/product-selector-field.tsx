"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { Search, X, Grid, List } from "@workspace/ui/lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import { Label } from "@workspace/ui/components/label";

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
  permalink: string;
}

type ProductSelectionValue = {
  selectionMode: "manual" | "filter";
  selectedProducts: Product[];
  filters: {
    category?: string;
    productType?: string;
    brand?: string;
  };
  maxProducts: number;
};

interface ProductSelectorFieldProps {
  value: ProductSelectionValue;
  onChange: (value: ProductSelectionValue) => void;
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
  const [pendingFilters, setPendingFilters] = useState<{
    category?: string;
    productType?: string;
    brand?: string;
  }>({
    category: value.filters.category,
    productType: value.filters.productType,
    brand: value.filters.brand,
  });

  useEffect(() => {
    if (isOpen && value.selectionMode === "filter") {
      setPendingFilters({
        category: value.filters.category,
        productType: value.filters.productType,
        brand: value.filters.brand,
      });
    }
  }, [isOpen, value.filters, value.selectionMode]);

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
      permalink: product.permalink || `product-${product.id}`, // Fallback if permalink is missing
    }));
  }, []);

  // Filter products based on search and current filters
  const activeFilters =
    value.selectionMode === "filter" ? pendingFilters : value.filters;

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
      if (activeFilters.category) {
        filtered = filtered.filter(
          (product) => product.category === activeFilters.category
        );
      }
      if (activeFilters.productType) {
        filtered = filtered.filter(
          (product) => product.type === activeFilters.productType
        );
      }
      if (activeFilters.brand) {
        filtered = filtered.filter(
          (product) => product.brand === activeFilters.brand
        );
      }
    }

    return filtered;
  }, [
    allProducts,
    searchTerm,
    value.selectionMode,
    activeFilters.category,
    activeFilters.productType,
    activeFilters.brand,
  ]);

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
      // Ensure product has all required fields including permalink
      const productWithPermalink: Product = {
        ...product,
        permalink: product.permalink || `product-${product.id}`,
      };
      newSelectedProducts = [...value.selectedProducts, productWithPermalink];
    }

    onChange({
      ...value,
      selectedProducts: newSelectedProducts,
    });
  };

  const getAllLabel = (type: "category" | "productType" | "brand") => {
    switch (type) {
      case "category":
        return "All categories";
      case "productType":
        return "All product types";
      default:
        return "All brands";
    }
  };

  const handlePendingFilterChange = (
    filterType: "category" | "productType" | "brand",
    filterValue: string
  ) => {
    setPendingFilters((prev) => ({
      ...prev,
      [filterType]: filterValue === "all" ? undefined : filterValue,
    }));
  };

  const handleMaxProductsChange = (inputValue: string) => {
    const parsed = parseInt(inputValue, 10);
    const clampedMax = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
    const trimmedSelected =
      value.selectedProducts.length > clampedMax
        ? value.selectedProducts.slice(0, clampedMax)
        : value.selectedProducts;

    onChange({
      ...value,
      maxProducts: clampedMax,
      selectedProducts: trimmedSelected,
    });
  };

  useEffect(() => {
    if (value.selectedProducts.length > value.maxProducts) {
      onChange({
        ...value,
        selectedProducts: value.selectedProducts.slice(0, value.maxProducts),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.maxProducts]);

  const handleApplyFilters = () => {
    const filtered = allProducts.filter((product) => {
      if (
        pendingFilters.category &&
        product.category !== pendingFilters.category
      ) {
        return false;
      }
      if (
        pendingFilters.productType &&
        product.type !== pendingFilters.productType
      ) {
        return false;
      }
      if (pendingFilters.brand && product.brand !== pendingFilters.brand) {
        return false;
      }
      return true;
    });

    // Ensure all products have permalink
    const productsWithPermalink = filtered
      .slice(0, value.maxProducts)
      .map((product) => ({
        ...product,
        permalink: product.permalink || `product-${product.id}`,
      }));

    onChange({
      ...value,
      selectionMode: "filter",
      filters: {
        category: pendingFilters.category,
        productType: pendingFilters.productType,
        brand: pendingFilters.brand,
      },
      selectedProducts: productsWithPermalink,
    });
    setIsOpen(false);
  };

  const handleModeChange = (mode: "manual" | "filter") => {
    if (mode === value.selectionMode) {
      setIsOpen(true);
      return;
    }

    onChange({
      ...value,
      selectionMode: mode,
      selectedProducts: mode === "filter" ? [] : value.selectedProducts,
      filters: mode === "filter" ? value.filters : {},
    });
    if (mode === "filter") {
      setPendingFilters({
        category: value.filters.category,
        productType: value.filters.productType,
        brand: value.filters.brand,
      });
    }
    setIsOpen(true);
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
          Filter Products
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <Label htmlFor="max-products" className="text-sm font-medium">
          Max products
        </Label>
        <Input
          id="max-products"
          type="number"
          min={1}
          value={value.maxProducts}
          onChange={(e) => handleMaxProductsChange(e.target.value)}
          className="w-24"
        />
      </div>

      {/* Selected Products Display */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Selected Products ({value.selectedProducts.length}/
            {value.maxProducts})
          </span>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh]">
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
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={pendingFilters.category || "all"}
                    onValueChange={(filterValue) =>
                      handlePendingFilterChange("category", filterValue)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {getAllLabel("category")}
                      </SelectItem>
                      {getFilterOptions("category").map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={pendingFilters.productType || "all"}
                    onValueChange={(filterValue) =>
                      handlePendingFilterChange("productType", filterValue)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {getAllLabel("productType")}
                      </SelectItem>
                      {getFilterOptions("productType").map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={pendingFilters.brand || "all"}
                    onValueChange={(filterValue) =>
                      handlePendingFilterChange("brand", filterValue)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {getAllLabel("brand")}
                      </SelectItem>
                      {getFilterOptions("brand").map((option) => (
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
                          <CardContent>
                            <div className="flex gap-3 items-center">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="object-cover w-16 h-auto rounded"
                              />
                              <div className="flex-1">
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
                              <p className="mr-2 text-xl font-medium">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: product.currencyCode,
                                }).format(Number(product.price))}
                              </p>
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
            {value.selectionMode === "filter" && (
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            )}
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
  );
}
