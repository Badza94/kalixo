"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@workspace/ui/components/sheet";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { SlidersHorizontal, X } from "@workspace/ui/lucide-react";
import productsData from "../data/productsData.json";

interface ProductData {
  id: number;
  productId: string;
  name: string;
  brand: string;
  type: string;
  price: string;
  platform?: string;
  [key: string]: unknown;
}

export type SortOption =
  | "price-low-high"
  | "price-high-low"
  | "name-a-z"
  | "name-z-a";

export interface CategoryFilters {
  priceMin?: number;
  priceMax?: number;
  types?: string[];
  brands?: string[];
  platforms?: string[];
}

export interface FilterBadge {
  key: string;
  label: string;
  value: string;
}

export interface CategoryFiltersBlockProps {
  // Callbacks for parent component
  onSortChange?: (sort: SortOption) => void;
  onFiltersChange?: (filters: CategoryFilters) => void;

  // Display options
  showFilterButton?: boolean;
  showSortSelect?: boolean;
  filterButtonText?: string;

  // Styling
  className?: string;
}

// Extract unique values from products data
const getUniqueValues = () => {
  const types = new Set<string>();
  const brands = new Set<string>();
  const platforms = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  (productsData as ProductData[]).forEach((product) => {
    if (product.type) types.add(product.type);
    if (product.brand) brands.add(product.brand);
    if (product.platform) platforms.add(product.platform);
    const price = parseFloat(product.price);
    if (price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
  });

  return {
    types: Array.from(types).sort(),
    brands: Array.from(brands).sort(),
    platforms: Array.from(platforms).sort(),
    priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
  };
};

export function CategoryFiltersBlock({
  onSortChange,
  onFiltersChange,
  showFilterButton = true,
  showSortSelect = true,
  filterButtonText = "Filters",
  className = "",
}: CategoryFiltersBlockProps) {
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("name-a-z");

  // Active filters state (from URL, shown in badges)
  const [activeFilters, setActiveFilters] = useState({
    types: [] as string[],
    brands: [] as string[],
    platforms: [] as string[],
    priceMin: "",
    priceMax: "",
  });

  // Draft filter states (in drawer - not applied until "Apply Filters" is clicked)
  const [draftPriceMin, setDraftPriceMin] = useState<string>("");
  const [draftPriceMax, setDraftPriceMax] = useState<string>("");
  const [draftTypes, setDraftTypes] = useState<string[]>([]);
  const [draftBrands, setDraftBrands] = useState<string[]>([]);
  const [draftPlatforms, setDraftPlatforms] = useState<string[]>([]);

  // Get unique filter options from products
  const filterOptions = useMemo(() => getUniqueValues(), []);

  // Initialize filters from URL on mount
  useEffect(() => {
    const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const platforms =
      searchParams.get("platforms")?.split(",").filter(Boolean) || [];
    const priceMin = searchParams.get("priceMin") || "";
    const priceMax = searchParams.get("priceMax") || "";
    const sort = searchParams.get("sort") as SortOption;

    setActiveFilters({ types, brands, platforms, priceMin, priceMax });
    if (sort) setSelectedSort(sort);
  }, [searchParams]);

  // When drawer opens, initialize draft filters from active filters
  useEffect(() => {
    if (isFilterOpen) {
      setDraftTypes([...activeFilters.types]);
      setDraftBrands([...activeFilters.brands]);
      setDraftPlatforms([...activeFilters.platforms]);
      setDraftPriceMin(activeFilters.priceMin);
      setDraftPriceMax(activeFilters.priceMax);
    }
  }, [isFilterOpen, activeFilters]);

  // Generate filter badges from active filters
  const filterBadges = useMemo(() => {
    const badges: FilterBadge[] = [];

    if (activeFilters.priceMin) {
      badges.push({
        key: "priceMin",
        label: "Min Price",
        value: `$${activeFilters.priceMin}`,
      });
    }
    if (activeFilters.priceMax) {
      badges.push({
        key: "priceMax",
        label: "Max Price",
        value: `$${activeFilters.priceMax}`,
      });
    }
    activeFilters.types.forEach((type) => {
      badges.push({ key: `type-${type}`, label: "Type", value: type });
    });
    activeFilters.brands.forEach((brand) => {
      badges.push({ key: `brand-${brand}`, label: "Brand", value: brand });
    });
    activeFilters.platforms.forEach((platform) => {
      badges.push({
        key: `platform-${platform}`,
        label: "Platform",
        value: platform,
      });
    });

    return badges;
  }, [activeFilters]);

  // Update URL without page refresh using History API
  const updateURL = useCallback(
    (filters: {
      types?: string[];
      brands?: string[];
      platforms?: string[];
      priceMin?: string;
      priceMax?: string;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams(window.location.search);

      // Update or remove each filter param
      if (filters.types !== undefined) {
        if (filters.types.length > 0) {
          params.set("types", filters.types.join(","));
        } else {
          params.delete("types");
        }
      }
      if (filters.brands !== undefined) {
        if (filters.brands.length > 0) {
          params.set("brands", filters.brands.join(","));
        } else {
          params.delete("brands");
        }
      }
      if (filters.platforms !== undefined) {
        if (filters.platforms.length > 0) {
          params.set("platforms", filters.platforms.join(","));
        } else {
          params.delete("platforms");
        }
      }
      if (filters.priceMin !== undefined) {
        if (filters.priceMin) {
          params.set("priceMin", filters.priceMin);
        } else {
          params.delete("priceMin");
        }
      }
      if (filters.priceMax !== undefined) {
        if (filters.priceMax) {
          params.set("priceMax", filters.priceMax);
        } else {
          params.delete("priceMax");
        }
      }
      if (filters.sort !== undefined) {
        params.set("sort", filters.sort);
      }

      const newURL = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.pushState(null, "", newURL);
    },
    []
  );

  const handleSortChange = (value: SortOption) => {
    setSelectedSort(value);
    updateURL({ sort: value });
    onSortChange?.(value);
  };

  const handleRemoveBadge = (badge: FilterBadge) => {
    const newFilters = { ...activeFilters };

    if (badge.key === "priceMin") {
      newFilters.priceMin = "";
    } else if (badge.key === "priceMax") {
      newFilters.priceMax = "";
    } else if (badge.key.startsWith("type-")) {
      newFilters.types = activeFilters.types.filter((t) => t !== badge.value);
    } else if (badge.key.startsWith("brand-")) {
      newFilters.brands = activeFilters.brands.filter((b) => b !== badge.value);
    } else if (badge.key.startsWith("platform-")) {
      newFilters.platforms = activeFilters.platforms.filter(
        (p) => p !== badge.value
      );
    }

    // Update state and URL
    setActiveFilters(newFilters);
    updateURL(newFilters);

    // Notify parent of filter change immediately for badge removal
    onFiltersChange?.({
      priceMin: newFilters.priceMin
        ? parseFloat(newFilters.priceMin)
        : undefined,
      priceMax: newFilters.priceMax
        ? parseFloat(newFilters.priceMax)
        : undefined,
      types: newFilters.types,
      brands: newFilters.brands,
      platforms: newFilters.platforms,
    });
  };

  const handleApplyFilters = () => {
    const newFilters = {
      types: draftTypes,
      brands: draftBrands,
      platforms: draftPlatforms,
      priceMin: draftPriceMin,
      priceMax: draftPriceMax,
    };

    // Update state and URL
    setActiveFilters(newFilters);
    updateURL(newFilters);

    // Notify parent
    onFiltersChange?.({
      priceMin: draftPriceMin ? parseFloat(draftPriceMin) : undefined,
      priceMax: draftPriceMax ? parseFloat(draftPriceMax) : undefined,
      types: draftTypes,
      brands: draftBrands,
      platforms: draftPlatforms,
    });

    setIsFilterOpen(false);
  };

  const handleClearAllFilters = () => {
    const emptyFilters = {
      types: [] as string[],
      brands: [] as string[],
      platforms: [] as string[],
      priceMin: "",
      priceMax: "",
    };

    // Clear draft filters
    setDraftPriceMin("");
    setDraftPriceMax("");
    setDraftTypes([]);
    setDraftBrands([]);
    setDraftPlatforms([]);

    // Update state and URL
    setActiveFilters(emptyFilters);
    updateURL(emptyFilters);

    onFiltersChange?.({});
  };

  const toggleType = (type: string) => {
    setDraftTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleBrand = (brand: string) => {
    setDraftBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const togglePlatform = (platform: string) => {
    setDraftPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const sortOptions = [
    { value: "price-low-high", label: "Price (Low - High)" },
    { value: "price-high-low", label: "Price (High - Low)" },
    { value: "name-a-z", label: "Name (A - Z)" },
    { value: "name-z-a", label: "Name (Z - A)" },
  ];

  return (
    <>
      <div
        className={`flex gap-3 justify-between items-center py-4 mb-4 border-b ${className}`}
      >
        {/* Filter Button - Left Side */}
        {showFilterButton && (
          <Button
            variant="outline"
            size="default"
            onClick={() => setIsFilterOpen(true)}
            className="flex gap-2 items-center"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{filterButtonText}</span>
            {filterBadges.length > 0 && (
              <span className="flex justify-center items-center w-5 h-5 text-xs font-medium text-white rounded-full bg-primary">
                {filterBadges.length}
              </span>
            )}
          </Button>
        )}

        {/* Sort Select - Right Side */}
        {showSortSelect && (
          <div className="flex gap-2 items-center">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Sort by:
            </span>
            <Select value={selectedSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Filter Badges - Middle */}
      <div className="flex flex-wrap flex-1 gap-2 mb-4 min-h-8">
        {filterBadges?.map((badge) => (
          <button
            key={badge.key}
            onClick={() => handleRemoveBadge(badge)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            <span className="text-xs text-muted-foreground">
              {badge.label}:
            </span>
            <span className="font-medium">{badge.value}</span>
            <X className="w-3.5 h-3.5 ml-1" />
          </button>
        ))}
        {filterBadges.length > 1 && (
          <button
            onClick={handleClearAllFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Drawer - Left Side */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="left"
          className="w-[320px] sm:w-[400px] flex flex-col"
        >
          <SheetHeader>
            <SheetTitle className="flex gap-2 items-center">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </SheetTitle>
            <SheetDescription>
              Refine your search by applying filters
            </SheetDescription>
          </SheetHeader>

          {/* Filter Content */}
          <div className="overflow-y-auto flex-1 p-4">
            <div className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Price Range</h4>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Label
                      htmlFor="priceMin"
                      className="text-xs text-muted-foreground"
                    >
                      Min
                    </Label>
                    <Input
                      id="priceMin"
                      type="number"
                      placeholder={`${filterOptions.priceRange.min}`}
                      value={draftPriceMin}
                      onChange={(e) => setDraftPriceMin(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <span className="mt-5 text-muted-foreground">-</span>
                  <div className="flex-1">
                    <Label
                      htmlFor="priceMax"
                      className="text-xs text-muted-foreground"
                    >
                      Max
                    </Label>
                    <Input
                      id="priceMax"
                      type="number"
                      placeholder={`${filterOptions.priceRange.max}`}
                      value={draftPriceMax}
                      onChange={(e) => setDraftPriceMax(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Product Type */}
              {filterOptions.types.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Product Type</h4>
                  <div className="space-y-2">
                    {filterOptions.types.map((type) => (
                      <div key={type} className="flex gap-2 items-center">
                        <Checkbox
                          id={`type-${type}`}
                          checked={draftTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                          className="w-[18px] h-[18px]"
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Brand */}
              {filterOptions.brands.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Brand</h4>
                  <div className="space-y-2">
                    {filterOptions.brands.map((brand) => (
                      <div key={brand} className="flex gap-2 items-center">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={draftBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                          className="w-[18px] h-[18px]"
                        />
                        <Label
                          htmlFor={`brand-${brand}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Platform */}
              {filterOptions.platforms.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Platform</h4>
                  <div className="space-y-2">
                    {filterOptions.platforms.map((platform) => (
                      <div key={platform} className="flex gap-2 items-center">
                        <Checkbox
                          id={`platform-${platform}`}
                          checked={draftPlatforms.includes(platform)}
                          onCheckedChange={() => togglePlatform(platform)}
                          className="w-[18px] h-[18px]"
                        />
                        <Label
                          htmlFor={`platform-${platform}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Apply/Clear buttons */}
          <div className="px-4 pt-4 pb-4 mt-auto space-y-2 border-t">
            <Button className="w-full" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearAllFilters}
            >
              Clear All
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
