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

// Predefined action functions
const buyNow = (id: string) => {
  console.log(`Buy now clicked for product: ${id}`);
  // In a real app, this would trigger the purchase flow
};

const addFav = (id: string) => {
  console.log(`Add to favorites clicked for product: ${id}`);
  // In a real app, this would add the product to favorites
};

const addCart = (id: string) => {
  console.log(`Add to cart clicked for product: ${id}`);
  // In a real app, this would add the product to cart
};

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

    const buttons = [
      {
        key: "buyNow",
        label: "Buy Now",
        onClick: () => buyNow(product.productId),
        variant: buyNowButton.variant,
        size: buyNowButton.size,
        colors: buttonColors.buyNow,
      },
      {
        key: "addToCart",
        label: "Add to Cart",
        onClick: () => addCart(product.productId),
        variant: addToCartButton.variant,
        size: addToCartButton.size,
        colors: buttonColors.addToCart,
        icon: <ShoppingBag className="w-4 h-4" />,
      },
      {
        key: "addToFav",
        label: "Add to Favourite",
        onClick: () => addFav(product.productId),
        variant: addToFavButton.variant,
        size: addToFavButton.size,
        colors: buttonColors.addToFav,
        icon: <Heart className="w-4 h-4" />,
      },
    ];

    if (buttonLayout === "icons-only") {
      return (
        <div className="flex gap-2 justify-center">
          {buttons.slice(1).map((button) => (
            <Button
              key={button.key}
              variant={button.variant}
              size={button.size}
              onClick={button.onClick}
              style={{
                backgroundColor: button.colors.backgroundColor,
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
                backgroundColor: button.colors.backgroundColor,
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
          {buttons.slice(1).map((button) => (
            <Button
              key={button.key}
              variant={button.variant}
              size={button.size}
              onClick={button.onClick}
              style={{
                backgroundColor: button.colors.backgroundColor,
                color: button.colors.textColor,
              }}
              className="flex-1 min-w-0 hover:cursor-pointer"
            >
              {button.icon && <span className="mr-2">{button.icon}</span>}
            </Button>
          ))}
        </div>
        <Button
          key={buttons[0].key}
          variant={buttons[0].variant}
          size={buttons[0].size}
          onClick={buttons[0].onClick}
          style={{
            backgroundColor: buttons[0].colors.backgroundColor,
            color: buttons[0].colors.textColor,
          }}
          className="w-full hover:cursor-pointer"
        >
          {buttons[0].label}
        </Button>
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

  return (
    <div className={`product-grid-block ${className}`} style={containerStyles}>
      <div className="overflow-x-auto">
        <div
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(150px, 1fr))`,
            minWidth: `${gridColumns * 160}px`, // 150px card + 10px gap
            width: "max-content",
          }}
        >
          {productSelection.selectedProducts.map(renderProductCard)}
        </div>
      </div>
    </div>
  );
}
