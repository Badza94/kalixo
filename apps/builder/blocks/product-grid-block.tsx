"use client";

import React, { useMemo } from "react";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import Image from "next/image";
import { BuyNowButton } from "@/components/product-actions/buy-now-button";
import { AddToCartButton } from "@/components/product-actions/add-to-cart-button";
import { WishlistButton } from "@/components/product-actions/wishlist-button";

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
}

export interface ProductGridBlockProps {
  // Product Selection
  productSelection?: {
    selectionMode: "manual" | "filter";
    selectedProducts: Product[];
    filters: {
      category?: string;
      productType?: string;
      brand?: string;
    };
    maxProducts: number;
  };

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

export function ProductGridBlock({
  productSelection = {
    selectionMode: "manual",
    selectedProducts: [],
    filters: {},
    maxProducts: 6,
  },
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
  imageAspectRatio = "square",
  imageSize = { width: 176, height: 176 },
  imageWrapper = {
    padding: { all: "0" },
    borderRadius: { size: "none" },
    backgroundColor: { colorKey: "transparent" },
  },
  className = "",
}: ProductGridBlockProps) {
  const { themeConfig } = useThemeConfig();

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
      // backgroundColor: resolvedBackgroundColor,
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

  console.log("resolvedBackgroundColor: ", resolvedBackgroundColor);

  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      className="p-3 space-y-2 rounded-lg border bg-card"
      style={{ backgroundColor: resolvedBackgroundColor }}
    >
      {/* Product Image */}
      <div
        className="overflow-hidden relative mx-auto w-full max-w-[176px]"
        style={{
          ...imageWrapperStyles,
          aspectRatio: imageAspectRatioValue,
        }}
      >
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
        <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>

        {showCategory && (
          <p className="text-sm text-muted-foreground">{product.category}</p>
        )}

        {showPrice && (
          <p className="text-lg font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: product.currencyCode,
            }).format(Number(product.price))}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {renderButtons(product)}
    </div>
  );

  // If no products selected, show placeholder
  if (!productSelection.selectedProducts.length) {
    return (
      <div
        className={`product-grid-block ${className}`}
        style={containerStyles}
      >
        <div className="py-8 text-center text-muted-foreground">
          <p>No products selected</p>
          <p className="text-sm">Use the property panel to select products</p>
        </div>
      </div>
    );
  }

  // Generate responsive grid classes based on gridColumns
  const getGridClasses = () => {
    // Base: always 1 column on mobile
    const base = "grid-cols-1";

    // Small screens: 2 columns
    const sm = "sm:grid-cols-2";

    // Medium screens: 3 columns
    const md = "md:grid-cols-3";

    // Large screens: use the configured gridColumns value
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

  return (
    <div className={`product-grid-block ${className}`} style={containerStyles}>
      <div className={`grid gap-2 mx-auto max-w-full ${getGridClasses()}`}>
        {productSelection.selectedProducts.map(renderProductCard)}
      </div>
    </div>
  );
}
