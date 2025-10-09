"use client";

import React, { useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { Heart, ShoppingBag } from "@workspace/ui/lucide-react";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import Image from "next/image";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface ProductCardBlockProps {
  productId?: string;
  image?: {
    src: string;
    alt: string;
  };
  productName?: string;
  category?: string;
  price?: string;
  currency?: string;
  showCategory?: boolean;
  showPrice?: boolean;
  showButtons?: boolean;
  buttonLayout?: "horizontal" | "vertical" | "icons-only";
  // Button styling options
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

// Predefined functions (these would be imported from your shop logic)
const buyNow = (id: string) => {
  console.log("Buy Now clicked for product:", id);
  // Your buy now logic here
};

const addFav = (id: string) => {
  console.log("Add to Favorites clicked for product:", id);
  // Your add to favorites logic here
};

const addCart = (id: string) => {
  console.log("Add to Cart clicked for product:", id);
  // Your add to cart logic here
};

export function ProductCardBlock({
  productId = "product-1",
  image = {
    src: "/shared/placeholder.svg",
    alt: "Product image",
  },
  productName = "Product Name",
  category = "Category",
  price = "99.99",
  currency = "$",
  showCategory = true,
  showPrice = true,
  showButtons = true,
  buttonLayout = "horizontal",
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
  backgroundColor,
  borderRadius,
  margin,
  padding,
  imageSize = {
    width: 176,
    height: 176,
  },
  imageWrapper = {
    padding: { all: "0" },
    borderRadius: { size: "none" },
    backgroundColor: { colorKey: "transparent" },
  },
  className = "",
}: ProductCardBlockProps) {
  const { themeConfig } = useThemeConfig();

  // Memoize color resolution to prevent infinite re-renders
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

  // Memoize button colors
  const buttonColors = useMemo(() => {
    const resolveButtonColors = (buttonConfig: typeof buyNowButton) => {
      const bgColor = buttonConfig?.backgroundColor
        ? resolveColor(
            buttonConfig.backgroundColor.colorKey,
            buttonConfig.backgroundColor.customColor,
            themeConfig || undefined,
            "light"
          )
        : undefined;

      const textColor = buttonConfig?.textColor
        ? resolveColor(
            buttonConfig.textColor.colorKey,
            buttonConfig.textColor.customColor,
            themeConfig || undefined,
            "light"
          )
        : undefined;

      return { bgColor, textColor };
    };

    return {
      buyNow: resolveButtonColors(buyNowButton),
      addToCart: resolveButtonColors(addToCartButton),
      addToFav: resolveButtonColors(addToFavButton),
    };
  }, [buyNowButton, addToCartButton, addToFavButton, themeConfig]);

  // Memoize border radius resolution
  const resolvedBorderRadius = useMemo(() => {
    const borderRadiusMap = {
      none: "0",
      xs: "2px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
      "3xl": "24px",
      "4xl": "32px",
      full: "9999px",
    };

    return borderRadius
      ? borderRadius.size === "custom" && borderRadius.customValue
        ? borderRadius.customValue
        : borderRadius.size !== "custom"
          ? borderRadiusMap[borderRadius.size]
          : undefined
      : undefined;
  }, [borderRadius]);

  // Memoize spacing functions
  const buildMargin = useMemo(() => {
    return (spacing?: SpacingValue) => {
      if (!spacing) return {};
      if (spacing.all) {
        return { margin: spacing.all };
      }
      return {
        marginTop: spacing.top || "0",
        marginRight: spacing.right || "0",
        marginBottom: spacing.bottom || "0",
        marginLeft: spacing.left || "0",
      };
    };
  }, []);

  const buildPadding = useMemo(() => {
    return (spacing?: SpacingValue) => {
      if (!spacing) return {};
      if (spacing.all) {
        return { padding: spacing.all };
      }
      return {
        paddingTop: spacing.top || "0",
        paddingRight: spacing.right || "0",
        paddingBottom: spacing.bottom || "0",
        paddingLeft: spacing.left || "0",
      };
    };
  }, []);

  // Memoize image wrapper styles
  const imageWrapperStyles = useMemo(() => {
    const wrapperBorderRadiusMap = {
      none: "0",
      xs: "2px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
      "3xl": "24px",
      "4xl": "32px",
      full: "9999px",
    };

    const resolvedWrapperBorderRadius = imageWrapper?.borderRadius
      ? imageWrapper.borderRadius.size === "custom" &&
        imageWrapper.borderRadius.customValue
        ? imageWrapper.borderRadius.customValue
        : imageWrapper.borderRadius.size !== "custom"
          ? wrapperBorderRadiusMap[imageWrapper.borderRadius.size]
          : undefined
      : undefined;

    const resolvedWrapperBackgroundColor = imageWrapper?.backgroundColor
      ? resolveColor(
          imageWrapper.backgroundColor.colorKey,
          imageWrapper.backgroundColor.customColor,
          themeConfig || undefined,
          "light"
        )
      : undefined;

    return {
      ...buildPadding(imageWrapper?.padding),
      ...(resolvedWrapperBorderRadius && {
        borderRadius: resolvedWrapperBorderRadius,
      }),
      ...(resolvedWrapperBackgroundColor && {
        backgroundColor: resolvedWrapperBackgroundColor,
      }),
    };
  }, [imageWrapper, buildPadding, themeConfig]);

  // Memoize container styles
  const containerStyles: React.CSSProperties = useMemo(
    () => ({
      ...buildMargin(margin),
      ...buildPadding(padding),
      ...(resolvedBackgroundColor && {
        backgroundColor: resolvedBackgroundColor,
      }),
      ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    }),
    [
      buildMargin,
      buildPadding,
      margin,
      padding,
      resolvedBackgroundColor,
      resolvedBorderRadius,
    ]
  );

  const renderButtons = () => {
    if (!showButtons) return null;

    if (buttonLayout === "icons-only") {
      return (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant={addToFavButton?.variant || "ghost"}
            size={addToFavButton?.size || "icon"}
            onClick={() => addFav(productId)}
            className="w-10 h-10"
            style={{
              ...(buttonColors.addToFav.bgColor && {
                backgroundColor: buttonColors.addToFav.bgColor,
              }),
              ...(buttonColors.addToFav.textColor && {
                color: buttonColors.addToFav.textColor,
              }),
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant={addToCartButton?.variant || "ghost"}
            size={addToCartButton?.size || "icon"}
            onClick={() => addCart(productId)}
            className="w-10 h-10"
            style={{
              ...(buttonColors.addToCart.bgColor && {
                backgroundColor: buttonColors.addToCart.bgColor,
              }),
              ...(buttonColors.addToCart.textColor && {
                color: buttonColors.addToCart.textColor,
              }),
            }}
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (buttonLayout === "vertical") {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant={addToFavButton?.variant || "ghost"}
            size={addToFavButton?.size || "sm"}
            onClick={() => addFav(productId)}
            className="w-full"
            style={{
              ...(buttonColors.addToFav.bgColor && {
                backgroundColor: buttonColors.addToFav.bgColor,
              }),
              ...(buttonColors.addToFav.textColor && {
                color: buttonColors.addToFav.textColor,
              }),
            }}
          >
            <Heart className="mr-2 w-4 h-4" />
            Add to Favorites
          </Button>
          <Button
            variant={addToCartButton?.variant || "ghost"}
            size={addToCartButton?.size || "sm"}
            onClick={() => addCart(productId)}
            className="w-full"
            style={{
              ...(buttonColors.addToCart.bgColor && {
                backgroundColor: buttonColors.addToCart.bgColor,
              }),
              ...(buttonColors.addToCart.textColor && {
                color: buttonColors.addToCart.textColor,
              }),
            }}
          >
            <ShoppingBag className="mr-2 w-4 h-4" />
            Add to Cart
          </Button>
          <Button
            variant={buyNowButton?.variant || "default"}
            size={buyNowButton?.size || "default"}
            onClick={() => buyNow(productId)}
            className="w-full"
            style={{
              ...(buttonColors.buyNow.bgColor && {
                backgroundColor: buttonColors.buyNow.bgColor,
              }),
              ...(buttonColors.buyNow.textColor && {
                color: buttonColors.buyNow.textColor,
              }),
            }}
          >
            Buy Now
          </Button>
        </div>
      );
    }

    // Default horizontal layout
    return (
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between items-center">
          <Button
            variant={addToFavButton?.variant || "ghost"}
            size={addToFavButton?.size || "sm"}
            onClick={() => addFav(productId)}
            className="flex-1 mr-1"
            style={{
              ...(buttonColors.addToFav.bgColor && {
                backgroundColor: buttonColors.addToFav.bgColor,
              }),
              ...(buttonColors.addToFav.textColor && {
                color: buttonColors.addToFav.textColor,
              }),
            }}
          >
            <Heart className="mr-1 w-4 h-4" />
            <span className="hidden sm:inline">Fav</span>
          </Button>
          <Button
            variant={addToCartButton?.variant || "ghost"}
            size={addToCartButton?.size || "sm"}
            onClick={() => addCart(productId)}
            className="flex-1 ml-1"
            style={{
              ...(buttonColors.addToCart.bgColor && {
                backgroundColor: buttonColors.addToCart.bgColor,
              }),
              ...(buttonColors.addToCart.textColor && {
                color: buttonColors.addToCart.textColor,
              }),
            }}
          >
            <ShoppingBag className="mr-1 w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
          </Button>
        </div>
        <Button
          variant={buyNowButton?.variant || "default"}
          size={buyNowButton?.size || "default"}
          onClick={() => buyNow(productId)}
          className="w-full"
          style={{
            ...(buttonColors.buyNow.bgColor && {
              backgroundColor: buttonColors.buyNow.bgColor,
            }),
            ...(buttonColors.buyNow.textColor && {
              color: buttonColors.buyNow.textColor,
            }),
          }}
        >
          Buy Now
        </Button>
      </div>
    );
  };

  return (
    <div
      className={`bg-white border border-gray-200 shadow-sm product-card-block dark:bg-gray-800 dark:border-gray-700 ${className}`}
      style={containerStyles}
    >
      {/* Product Image */}
      <div
        className="overflow-hidden relative mx-auto max-w-full"
        style={{
          ...imageWrapperStyles,
          // width: `${imageSize.width}px`,
          // height: `${imageSize.height}px`,
        }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          className="object-cover mx-auto"
          width={imageSize.width || 176}
          height={imageSize.height || 176}
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {productName}
        </h3>

        {/* Category */}
        {showCategory && (
          <p className="mb-2 text-sm text-blue-500 dark:text-blue-400">
            {category}
          </p>
        )}

        {/* Price */}
        {showPrice && (
          <p className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {currency}
            {price}
          </p>
        )}

        {/* Buttons */}
        {renderButtons()}
      </div>
    </div>
  );
}
