"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import { BuyNowButton } from "@/components/product-actions/buy-now-button";
import { AddToCartButton } from "@/components/product-actions/add-to-cart-button";
import { WishlistButton } from "@/components/product-actions/wishlist-button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import productsData from "../data/productsData.json";
import type { SortOption, CategoryFilters } from "./category-filters-block";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

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
  leftBadge?: string;
  rightBadge?: string;
  newPrice?: string;
  platform?: string;
}

export interface PaginatedProductGridBlockProps {
  // Pagination
  itemsPerPage?: number;
  showPagination?: boolean;

  // Filtering (auto-syncs with CategoryFiltersBlock via URL)
  syncWithFilters?: boolean;

  // Display options
  showCategory?: boolean;
  showPrice?: boolean;
  showButtons?: boolean;
  buttonLayout?: "horizontal" | "vertical" | "icons-only";
  gridColumns?: 1 | 2 | 3 | 4 | 5 | 6;

  // Button customization
  buyNowButton?: {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "input"
      | "text";
    size?: "default" | "sm" | "lg" | "icon";
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    textColor?: {
      colorKey: string;
      customColor?: string;
    };
  };
  addToCartButton?: {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "input"
      | "text";
    size?: "default" | "sm" | "lg" | "icon";
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    textColor?: {
      colorKey: string;
      customColor?: string;
    };
  };
  addToFavButton?: {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "input"
      | "text";
    size?: "default" | "sm" | "lg" | "icon";
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    textColor?: {
      colorKey: string;
      customColor?: string;
    };
  };

  // Styling
  backgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  borderRadius?: {
    size:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "none"
      | "full"
      | "custom";
    customValue?: string;
  };
  margin?: SpacingValue;
  padding?: SpacingValue;
  gap?: SpacingValue;
  imageAspectRatio?: "square" | "4/3" | "3/2" | "16/9";
  imageSize?: {
    width?: number;
    height?: number;
  };
  imageWrapper?: {
    padding?: SpacingValue;
    borderRadius?: {
      size:
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "none"
        | "full"
        | "custom";
      customValue?: string;
    };
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
  };
  className?: string;
}

export function PaginatedProductGridBlock({
  itemsPerPage = 12,
  showPagination = true,
  syncWithFilters = true,
  showCategory = true,
  showPrice = true,
  showButtons = true,
  buttonLayout = "horizontal",
  gridColumns = 3,
  buyNowButton = {
    variant: "default",
    size: "default",
    backgroundColor: { colorKey: "primary" },
    textColor: { colorKey: "primary-foreground" },
  },
  addToCartButton = {
    variant: "ghost",
    size: "sm",
    backgroundColor: { colorKey: "transparent" },
    textColor: { colorKey: "foreground" },
  },
  addToFavButton = {
    variant: "ghost",
    size: "sm",
    backgroundColor: { colorKey: "transparent" },
    textColor: { colorKey: "foreground" },
  },
  backgroundColor = { colorKey: "card" },
  borderRadius = { size: "lg" },
  margin = {},
  padding = { all: "0" },
  gap = { all: "8px" },
  imageAspectRatio = "square",
  imageSize = { width: 176, height: 176 },
  imageWrapper = {
    padding: { all: "0" },
    borderRadius: { size: "none" },
    backgroundColor: { colorKey: "transparent" },
  },
  className = "",
}: PaginatedProductGridBlockProps) {
  const { themeConfig } = useThemeConfig();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extract brand from URL path (e.g., /category/kalixo -> "kalixo")
  const brandFromUrl = useMemo(() => {
    const pathParts = pathname.split("/");
    const categoryIndex = pathParts.indexOf("category");
    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      // Capitalize first letter to match product data (e.g., "kalixo" -> "Kalixo")
      const brand = pathParts[categoryIndex + 1];
      return brand.charAt(0).toUpperCase() + brand.slice(1);
    }
    return null;
  }, [pathname]);

  // Read current page from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Read filters from URL (syncs with CategoryFiltersBlock)
  const urlFilters = useMemo((): CategoryFilters => {
    if (!syncWithFilters) return {};

    const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const platforms =
      searchParams.get("platforms")?.split(",").filter(Boolean) || [];
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");

    return {
      types: types.length > 0 ? types : undefined,
      brands: brands.length > 0 ? brands : undefined,
      platforms: platforms.length > 0 ? platforms : undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
    };
  }, [searchParams, syncWithFilters]);

  // Read sort from URL
  const sortOption = (searchParams.get("sort") as SortOption) || "name-a-z";

  // Filter, sort, and paginate products
  const { filteredProducts, totalPages, paginatedProducts } = useMemo(() => {
    let products = productsData as Product[];

    // Apply brand filter from URL (e.g., /category/kalixo -> brand: "Kalixo")
    if (brandFromUrl) {
      products = products.filter((p) => p.brand === brandFromUrl);
    }

    // Apply filters from URL
    if (syncWithFilters && urlFilters) {
      if (urlFilters.types && urlFilters.types.length > 0) {
        products = products.filter((p) => urlFilters.types!.includes(p.type));
      }
      if (urlFilters.brands && urlFilters.brands.length > 0) {
        products = products.filter((p) => urlFilters.brands!.includes(p.brand));
      }
      if (urlFilters.platforms && urlFilters.platforms.length > 0) {
        products = products.filter((p) =>
          urlFilters.platforms!.includes(p.platform || "")
        );
      }
      if (urlFilters.priceMin !== undefined) {
        products = products.filter(
          (p) => parseFloat(p.price) >= urlFilters.priceMin!
        );
      }
      if (urlFilters.priceMax !== undefined) {
        products = products.filter(
          (p) => parseFloat(p.price) <= urlFilters.priceMax!
        );
      }
    }

    // Apply sorting
    const sortedProducts = [...products].sort((a, b) => {
      switch (sortOption) {
        case "price-low-high":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high-low":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    // Calculate pagination
    const total = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedProducts.slice(startIndex, endIndex);

    return {
      filteredProducts: sortedProducts,
      totalPages: total,
      paginatedProducts: paginated,
    };
  }, [
    brandFromUrl,
    syncWithFilters,
    urlFilters,
    sortOption,
    currentPage,
    itemsPerPage,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const params = new URLSearchParams(window.location.search);
      params.set("page", "1");
      router.replace(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [urlFilters, sortOption, currentPage, totalPages, router]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
    router.refresh();
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Memoized color resolution
  const resolvedBackgroundColor = useMemo(() => {
    return backgroundColor
      ? resolveColor(
          backgroundColor.colorKey,
          backgroundColor.customColor,
          themeConfig || undefined,
          "light"
        )
      : undefined;
  }, [backgroundColor, themeConfig]);

  const buttonColors = useMemo(() => {
    return {
      buyNow: {
        backgroundColor: buyNowButton.backgroundColor
          ? resolveColor(
              buyNowButton.backgroundColor.colorKey,
              buyNowButton.backgroundColor.customColor,
              themeConfig || undefined,
              "light"
            )
          : undefined,
        textColor: buyNowButton.textColor
          ? resolveColor(
              buyNowButton.textColor.colorKey,
              buyNowButton.textColor.customColor,
              themeConfig || undefined,
              "light"
            )
          : undefined,
      },
      addToCart: {
        backgroundColor: addToCartButton.backgroundColor
          ? resolveColor(
              addToCartButton.backgroundColor.colorKey,
              addToCartButton.backgroundColor.customColor,
              themeConfig || undefined,
              "light"
            )
          : undefined,
        textColor: addToCartButton.textColor
          ? resolveColor(
              addToCartButton.textColor.colorKey,
              addToCartButton.textColor.customColor,
              themeConfig || undefined,
              "light"
            )
          : undefined,
      },
      addToFav: {
        backgroundColor: addToFavButton.backgroundColor
          ? resolveColor(
              addToFavButton.backgroundColor.colorKey,
              addToFavButton.backgroundColor.customColor,
              themeConfig || undefined,
              "light"
            )
          : undefined,
        textColor: addToFavButton.textColor
          ? resolveColor(
              addToFavButton.textColor.colorKey,
              addToFavButton.textColor.customColor,
              themeConfig || undefined,
              "light"
            )
          : undefined,
      },
    };
  }, [buyNowButton, addToCartButton, addToFavButton, themeConfig]);

  const resolvedBorderRadius = useMemo(() => {
    if (borderRadius.size === "custom" && borderRadius.customValue) {
      return borderRadius.customValue;
    }
    return borderRadius.size;
  }, [borderRadius]);

  const buildMargin = useMemo(() => {
    const marginObj = margin || {};
    return {
      marginTop: marginObj.top || marginObj.all || "0",
      marginRight: marginObj.right || marginObj.all || "0",
      marginBottom: marginObj.bottom || marginObj.all || "0",
      marginLeft: marginObj.left || marginObj.all || "0",
    };
  }, [margin]);

  const buildPadding = useMemo(() => {
    const paddingObj = padding || {};
    return {
      paddingTop: paddingObj.top || paddingObj.all || "0",
      paddingRight: paddingObj.right || paddingObj.all || "0",
      paddingBottom: paddingObj.bottom || paddingObj.all || "0",
      paddingLeft: paddingObj.left || paddingObj.all || "0",
    };
  }, [padding]);

  const buildGap = useMemo(() => {
    const gapObj = gap || {};
    return (
      gapObj.all ||
      gapObj.top ||
      gapObj.right ||
      gapObj.bottom ||
      gapObj.left ||
      "8px"
    );
  }, [gap]);

  const imageAspectRatioValue = useMemo(() => {
    const aspectRatioMap = {
      square: "1/1",
      "4/3": "4/3",
      "3/2": "3/2",
      "16/9": "16/9",
    };
    return aspectRatioMap[imageAspectRatio];
  }, [imageAspectRatio]);

  const imageWrapperStyles = useMemo(() => {
    const wrapperPadding = imageWrapper.padding || {};
    const wrapperBorderRadius = imageWrapper.borderRadius || { size: "none" };
    const wrapperBackgroundColor = imageWrapper.backgroundColor || {
      colorKey: "transparent",
    };

    return {
      paddingTop: wrapperPadding.top || wrapperPadding.all || "0",
      paddingRight: wrapperPadding.right || wrapperPadding.all || "0",
      paddingBottom: wrapperPadding.bottom || wrapperPadding.all || "0",
      paddingLeft: wrapperPadding.left || wrapperPadding.all || "0",
      borderRadius:
        wrapperBorderRadius.size === "custom" && wrapperBorderRadius.customValue
          ? wrapperBorderRadius.customValue
          : wrapperBorderRadius.size,
      backgroundColor: wrapperBackgroundColor
        ? resolveColor(
            wrapperBackgroundColor.colorKey,
            wrapperBackgroundColor.customColor,
            themeConfig || undefined,
            "light"
          )
        : undefined,
    };
  }, [imageWrapper, themeConfig]);

  const containerStyles = useMemo(
    () => ({
      ...buildMargin,
      ...buildPadding,
      borderRadius: resolvedBorderRadius,
    }),
    [buildMargin, buildPadding, resolvedBorderRadius]
  );

  const renderButtons = (product: Product) => {
    if (!showButtons) return null;

    if (buttonLayout === "icons-only") {
      return (
        <div className="flex gap-2 justify-center">
          <AddToCartButton
            productId={product.productId}
            product={product}
            variant={addToCartButton?.variant}
            size={addToCartButton?.size}
            backgroundColor={buttonColors.addToCart.backgroundColor}
            textColor={buttonColors.addToCart.textColor}
          />
          <WishlistButton
            productId={product.productId}
            product={product}
            variant={addToFavButton?.variant}
            size={addToFavButton?.size}
            backgroundColor={buttonColors.addToFav.backgroundColor}
            textColor={buttonColors.addToFav.textColor}
          />
        </div>
      );
    }

    if (buttonLayout === "vertical") {
      return (
        <div className="space-y-2">
          <BuyNowButton
            productId={product.productId}
            variant={buyNowButton?.variant}
            size={buyNowButton?.size}
            backgroundColor={buttonColors.buyNow.backgroundColor}
            textColor={buttonColors.buyNow.textColor}
            className="w-full"
          />
          <AddToCartButton
            productId={product.productId}
            product={product}
            variant={addToCartButton?.variant}
            size={addToCartButton?.size}
            backgroundColor={buttonColors.addToCart.backgroundColor}
            textColor={buttonColors.addToCart.textColor}
            className="w-full"
          />
          <WishlistButton
            productId={product.productId}
            product={product}
            variant={addToFavButton?.variant}
            size={addToFavButton?.size}
            backgroundColor={buttonColors.addToFav.backgroundColor}
            textColor={buttonColors.addToFav.textColor}
            className="w-full"
          />
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <AddToCartButton
            productId={product.productId}
            product={product}
            variant={addToCartButton?.variant}
            size={addToCartButton?.size}
            backgroundColor={buttonColors.addToCart.backgroundColor}
            textColor={buttonColors.addToCart.textColor}
            className="flex-1"
          />
          <WishlistButton
            productId={product.productId}
            product={product}
            variant={addToFavButton?.variant}
            size={addToFavButton?.size}
            backgroundColor={buttonColors.addToFav.backgroundColor}
            textColor={buttonColors.addToFav.textColor}
            className="flex-1"
          />
        </div>
        <BuyNowButton
          productId={product.productId}
          variant={buyNowButton?.variant}
          size={buyNowButton?.size}
          backgroundColor={buttonColors.buyNow.backgroundColor}
          textColor={buttonColors.buyNow.textColor}
          className="w-full"
        />
      </div>
    );
  };

  const renderProductCard = (product: Product) => {
    const productUrl = product.permalink
      ? `/product/${product.permalink}`
      : "#";

    return (
      <Link
        key={product.id}
        href={productUrl}
        className="block p-3 space-y-2 rounded-lg border transition-opacity cursor-pointer bg-card hover:opacity-90"
        style={{ backgroundColor: resolvedBackgroundColor }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) {
            e.preventDefault();
          }
        }}
      >
        {/* Product Image */}
        <div
          className="overflow-hidden relative mx-auto w-full max-w-[176px]"
          style={{
            ...imageWrapperStyles,
            aspectRatio: imageAspectRatioValue,
          }}
        >
          {product.leftBadge && (
            <span className="absolute top-2 left-2 z-10 px-2 py-1 text-xs font-semibold text-white uppercase bg-red-500 rounded">
              {product.leftBadge}
            </span>
          )}
          {product.rightBadge && (
            <span className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-semibold text-white uppercase bg-blue-500 rounded">
              {product.rightBadge}
            </span>
          )}
          <Image
            src={product.image}
            alt={product.name}
            className="object-cover mx-auto w-full h-full"
            width={imageSize.width || 176}
            height={imageSize.height || 176}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2 text-left">
          <h3 className="text-lg font-semibold leading-tight">
            {product.name}
          </h3>

          {showCategory && (
            <p className="text-sm text-muted-foreground">{product.category}</p>
          )}

          {showPrice && (
            <div className="flex flex-wrap gap-2 items-center">
              {product.newPrice ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: product.currencyCode,
                    }).format(Number(product.newPrice))}
                  </span>
                  <span className="text-sm line-through text-muted-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: product.currencyCode,
                    }).format(Number(product.price))}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: product.currencyCode,
                  }).format(Number(product.price))}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {renderButtons(product)}
      </Link>
    );
  };

  // Generate responsive grid classes
  const getGridClasses = () => {
    const base = "grid-cols-1";
    const sm = "sm:grid-cols-2";
    const md = "md:grid-cols-3";

    let lg = "";
    if (gridColumns >= 6) {
      lg = "lg:grid-cols-6";
    } else if (gridColumns === 5) {
      lg = "lg:grid-cols-5";
    } else if (gridColumns === 4) {
      lg = "lg:grid-cols-4";
    } else if (gridColumns === 3) {
      lg = "lg:grid-cols-3";
    } else if (gridColumns === 2) {
      lg = "lg:grid-cols-2";
    } else {
      lg = "lg:grid-cols-1";
    }

    return `${base} ${sm} ${md} ${lg}`;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }
    return pages;
  };

  // Show message if no products found
  if (filteredProducts.length === 0) {
    return (
      <div
        className={`paginated-product-grid-block ${className}`}
        style={containerStyles}
      >
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`paginated-product-grid-block ${className}`}
      style={containerStyles}
    >
      {/* Results summary */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
        {filteredProducts.length} products
      </div>

      {/* Product Grid */}
      <div
        className={`grid mx-auto max-w-full ${getGridClasses()}`}
        style={{ gap: buildGap }}
      >
        {paginatedProducts.map(renderProductCard)}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, idx) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
