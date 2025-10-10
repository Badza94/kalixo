"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Heart, ShoppingBag } from "@workspace/ui/lucide-react";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import Image from "next/image";

// Import products data (in production, this would be an API call)
import productsData from "../data/productsData.json";

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

export interface ProductCardBlockProps {
  productId?: string;
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
  // padding?: SpacingValue;
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
  productId = "17056",
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
  // padding,
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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // In production, this would be an API call
        // const response = await fetch(`/api/products/${productId}`);
        // const productData = await response.json();

        // For now, find product in the imported data
        const foundProduct = productsData.find(
          (p) => p.id.toString() === productId || p.productId === productId
        );

        if (foundProduct) {
          setProduct({
            id: foundProduct.id,
            productId: foundProduct.productId,
            name: foundProduct.name,
            brand: foundProduct.brand,
            type: foundProduct.type,
            category: foundProduct.category,
            price: foundProduct.price,
            currencyCode: foundProduct.currencyCode,
            image: foundProduct.image,
          });
        } else {
          setError(`Product with ID ${productId} not found`);
          setProduct(null);
        }
      } catch (err) {
        setError(
          `Failed to fetch product data: ${err instanceof Error ? err.message : "Unknown error"}`
        );
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
      // ...buildPadding(padding),
      ...(resolvedBackgroundColor && {
        backgroundColor: resolvedBackgroundColor,
      }),
      ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    }),
    [
      buildMargin,
      // buildPadding,
      margin,
      // padding,
      resolvedBackgroundColor,
      resolvedBorderRadius,
    ]
  );

  const renderButtons = () => {
    if (!showButtons) return null;

    const buttons = [
      {
        key: "addToCart",
        label: "Add to Cart",
        onClick: () => addCart(productId),
        variant: addToCartButton?.variant || "ghost",
        size: addToCartButton?.size || "sm",
        colors: buttonColors.addToCart,
        icon: <ShoppingBag className="w-4 h-4" />,
      },
      {
        key: "addToFav",
        label: "Add to Favourite",
        onClick: () => addFav(productId),
        variant: addToFavButton?.variant || "ghost",
        size: addToFavButton?.size || "sm",
        colors: buttonColors.addToFav,
        icon: <Heart className="w-4 h-4" />,
      },
      {
        key: "buyNow",
        label: "Buy Now",
        onClick: () => buyNow(productId),
        variant: buyNowButton?.variant || "default",
        size: buyNowButton?.size || "default",
        colors: buttonColors.buyNow,
      },
    ];

    if (buttonLayout === "icons-only") {
      return (
        <div className="flex gap-2 justify-center">
          {buttons.slice(0, 2).map((button) => (
            <Button
              key={button.key}
              variant={button.variant}
              size={button.size}
              onClick={button.onClick}
              style={{
                backgroundColor: button.colors.bgColor,
                color: button.colors.textColor,
              }}
              className="flex-shrink-0 hover:cursor-pointer"
            >
              {button.icon}
            </Button>
          ))}
        </div>
      );
    }

    if (buttonLayout === "vertical") {
      return (
        <div className="space-y-2">
          {buttons.map((button) => (
            <Button
              key={button.key}
              variant={button.variant}
              size={button.size}
              onClick={button.onClick}
              style={{
                backgroundColor: button.colors.bgColor,
                color: button.colors.textColor,
              }}
              className="w-full hover:cursor-pointer"
            >
              {button.icon && <span className="mr-2">{button.icon}</span>}
              {button.label}
            </Button>
          ))}
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {buttons.slice(0, 2).map((button) => (
            <Button
              key={button.key}
              variant={button.variant}
              size={button.size}
              onClick={button.onClick}
              style={{
                backgroundColor: button.colors.bgColor,
                color: button.colors.textColor,
              }}
              className="flex-1 min-w-0 hover:cursor-pointer"
            >
              {button.icon && <span className="mr-2">{button.icon}</span>}
            </Button>
          ))}
        </div>
        <Button
          key={buttons[2].key}
          variant={buttons[2].variant}
          size={buttons[2].size}
          onClick={buttons[2].onClick}
          style={{
            backgroundColor: buttons[2].colors.bgColor,
            color: buttons[2].colors.textColor,
          }}
          className="w-full hover:cursor-pointer"
        >
          {buttons[2].label}
        </Button>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className={`bg-white border border-gray-200 shadow-sm product-card-block dark:bg-gray-800 dark:border-gray-700 ${className}`}
        style={containerStyles}
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 w-32 h-32 bg-gray-200 rounded"></div>
            <div className="mb-2 h-4 bg-gray-200 rounded"></div>
            <div className="mx-auto mb-2 w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="mx-auto mb-4 w-1/2 h-4 bg-gray-200 rounded"></div>
          </div>
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`p-3 space-y-2 bg-white rounded-lg border border-red-200 shadow-sm product-card-block dark:bg-gray-800 dark:border-red-700 ${className}`}
        style={containerStyles}
      >
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-32 h-32 bg-red-50 rounded">
            <p className="text-sm text-red-500">⚠️</p>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <p className="mt-1 text-xs text-gray-500">
            Check the product ID: {productId}
          </p>
        </div>
      </div>
    );
  }

  // Show no product state
  if (!product) {
    return (
      <div
        className={`p-3 space-y-2 bg-white rounded-lg border border-gray-200 shadow-sm product-card-block dark:bg-gray-800 dark:border-gray-700 ${className}`}
        style={containerStyles}
      >
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-32 h-32 bg-gray-50 rounded">
            <p className="text-sm text-gray-400">📦</p>
          </div>
          <p className="text-sm text-gray-500">No product selected</p>
          <p className="mt-1 text-xs text-gray-400">
            Enter a product ID to load product data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 space-y-2 bg-white rounded-lg border border-gray-200 shadow-sm product-card-block dark:bg-gray-800 dark:border-gray-700 ${className}`}
      style={containerStyles}
    >
      {/* Product Image */}
      <div
        className="overflow-hidden relative mx-auto w-full max-w-[176px]"
        style={{
          ...imageWrapperStyles,
          aspectRatio: "1/1",
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

      {/* Product Details */}
      <div className="space-y-2 text-left">
        {/* Product Name */}
        <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>

        {/* Category */}
        {showCategory && (
          <p className="text-sm text-muted-foreground">{product.category}</p>
        )}

        {/* Price */}
        {showPrice && (
          <p className="text-lg font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: product.currencyCode,
            }).format(Number(product.price))}
          </p>
        )}

        {/* Buttons */}
        {renderButtons()}
      </div>
    </div>
  );
}
