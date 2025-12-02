"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { BuyNowButton } from "@/components/product-actions/buy-now-button";
import { AddToCartButton } from "@/components/product-actions/add-to-cart-button";
import { WishlistButton } from "@/components/product-actions/wishlist-button";
import { ProductGridBlock } from "./product-grid-block";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import productsData from "../data/productsData.json";

interface ProductImage {
  id: string;
  url: string;
  isDefault?: boolean;
}

export interface ProductPageBlockProps {
  // Product Data
  productId?: string;
  title?: string;
  brand?: string;
  price?: number;
  currencyCode?: string;
  discount?: string;
  reducedPrice?: string;
  newPrice?: string;
  leftBadge?: string;
  rightBadge?: string;
  shortDescription?: string;
  longDescription?: string;
  termsAndConditions?: string;
  redemptionInstructions?: string;
  images?: ProductImage[];

  // Display Options
  showBrand?: boolean;
  showShortDescription?: boolean;
  showLongDescription?: boolean;
  showTermsAndConditions?: boolean;
  showRedemptionInstructions?: boolean;
  showRelatedProducts?: boolean;

  // Button Configuration
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
    backgroundColor?: { colorKey: string; customColor?: string };
    textColor?: { colorKey: string; customColor?: string };
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
    backgroundColor?: { colorKey: string; customColor?: string };
    textColor?: { colorKey: string; customColor?: string };
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
    backgroundColor?: { colorKey: string; customColor?: string };
    textColor?: { colorKey: string; customColor?: string };
  };

  // Related Products
  relatedProducts?: {
    selectionMode: "manual" | "filter";
    selectedProducts: Array<{
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
    }>;
    filters: {
      category?: string;
      productType?: string;
      brand?: string;
    };
    maxProducts: number;
  };

  // Styling
  backgroundColor?: { colorKey: string; customColor?: string };
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    all?: string;
  };
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    all?: string;
  };
  className?: string;
}

export function ProductPageBlock({
  productId = "17056",
  title = "Kalixo wallet",
  brand = "Kalixo",
  price = 10,
  currencyCode = "GBP",
  discount = "0",
  reducedPrice = "0.00",
  newPrice,
  leftBadge,
  rightBadge,
  shortDescription = "Kalixo wallet",
  longDescription = "",
  termsAndConditions = "",
  redemptionInstructions = "",
  images = [
    {
      id: "1",
      url: "https://cdn.kalixo.io/static-images/GB-en-KW1.png",
      isDefault: true,
    },
  ],
  showBrand = true,
  showShortDescription = true,
  showLongDescription = true,
  showTermsAndConditions = true,
  showRedemptionInstructions = true,
  showRelatedProducts = true,
  buyNowButton = {
    variant: "default",
    size: "default",
    backgroundColor: { colorKey: "primary" },
    textColor: { colorKey: "primary-foreground" },
  },
  addToCartButton = {
    variant: "outline",
    size: "default",
    backgroundColor: { colorKey: "transparent" },
    textColor: { colorKey: "foreground" },
  },
  addToFavButton = {
    variant: "ghost",
    size: "default",
    backgroundColor: { colorKey: "transparent" },
    textColor: { colorKey: "foreground" },
  },
  relatedProducts,
  backgroundColor = { colorKey: "background" },
  margin = {},
  padding = {},
  className = "",
}: ProductPageBlockProps) {
  const { themeConfig } = useThemeConfig();

  // Find product data from productsData.json based on productId
  const productData = useMemo(() => {
    return productsData.find(
      (p) =>
        p.id.toString() === productId ||
        p.productId === productId ||
        p.permalink === productId
    );
  }, [productId]);

  // Use product data values if available, otherwise fall back to props
  const resolvedLeftBadge = leftBadge || (productData as any)?.leftBadge;
  const resolvedRightBadge = rightBadge || (productData as any)?.rightBadge;
  const resolvedNewPrice = newPrice || (productData as any)?.newPrice;

  // Find default image or use first image
  const defaultImageIndex = useMemo(() => {
    const defaultIdx = images.findIndex((img) => img.isDefault);
    return defaultIdx >= 0 ? defaultIdx : 0;
  }, [images]);

  const [currentImageIndex, setCurrentImageIndex] = useState(defaultImageIndex);

  const currentImage = images[currentImageIndex] || images[0];

  // Resolve colors
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

  // Build margin and padding
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

  // Format price
  const formattedPrice = useMemo(() => {
    const priceValue =
      discount && discount !== "0" && reducedPrice
        ? Number(reducedPrice)
        : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(priceValue);
  }, [price, currencyCode, discount, reducedPrice]);

  const containerStyles = useMemo(
    () => ({
      ...buildMargin,
      ...buildPadding,
      backgroundColor: resolvedBackgroundColor,
    }),
    [buildMargin, buildPadding, resolvedBackgroundColor]
  );

  return (
    <div className={`product-page-block ${className}`} style={containerStyles}>
      <div className="container px-4 py-8 mx-auto max-w-7xl mt-[100px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="overflow-hidden relative w-full rounded-lg border aspect-square bg-card">
              {/* Left Badge */}
              {resolvedLeftBadge && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 text-sm font-semibold text-white uppercase bg-red-500 rounded-md">
                  {resolvedLeftBadge}
                </span>
              )}
              {/* Right Badge */}
              {resolvedRightBadge && (
                <span className="absolute top-4 right-4 z-10 px-3 py-1.5 text-sm font-semibold text-white uppercase bg-blue-500 rounded-md">
                  {resolvedRightBadge}
                </span>
              )}
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={title || "Product image"}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-md border transition-all ${
                      currentImageIndex === index
                        ? "ring-2 ring-primary"
                        : "hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              {showBrand && brand && (
                <p className="mt-2 text-lg text-muted-foreground">{brand}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex gap-3 items-baseline">
              {resolvedNewPrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: currencyCode,
                    }).format(Number(resolvedNewPrice))}
                  </span>
                  <span className="text-lg line-through text-muted-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: currencyCode,
                    }).format(price)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold">{formattedPrice}</span>
                  {discount && discount !== "0" && (
                    <span className="text-lg line-through text-muted-foreground">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: currencyCode,
                      }).format(price)}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Short Description */}
            {showShortDescription && shortDescription && (
              <p className="text-lg leading-relaxed">{shortDescription}</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <BuyNowButton
                productId={productId}
                variant={buyNowButton?.variant}
                size={buyNowButton?.size}
                backgroundColor={buttonColors.buyNow.backgroundColor}
                textColor={buttonColors.buyNow.textColor}
                className="flex-1 min-w-[200px]"
              />
              <AddToCartButton
                productId={productId}
                variant={addToCartButton?.variant}
                size={addToCartButton?.size}
                backgroundColor={buttonColors.addToCart.backgroundColor}
                textColor={buttonColors.addToCart.textColor}
                className="flex-1 min-w-[200px]"
              />
              <WishlistButton
                productId={productId}
                product={{
                  id: Number(productId),
                  productId: productId,
                }}
                variant={addToFavButton?.variant}
                size={addToFavButton?.size}
                backgroundColor={buttonColors.addToFav.backgroundColor}
                textColor={buttonColors.addToFav.textColor}
              />
            </div>

            {/* Accordions */}
            <Accordion type="single" collapsible className="w-full">
              {showLongDescription && longDescription && (
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="whitespace-pre-line">{longDescription}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {showTermsAndConditions && termsAndConditions && (
                <AccordionItem value="terms">
                  <AccordionTrigger>Terms and Conditions</AccordionTrigger>
                  <AccordionContent>
                    <p className="whitespace-pre-line">{termsAndConditions}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {showRedemptionInstructions && redemptionInstructions && (
                <AccordionItem value="redemption">
                  <AccordionTrigger>Redemption Instructions</AccordionTrigger>
                  <AccordionContent>
                    <p className="whitespace-pre-line">
                      {redemptionInstructions}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {showRelatedProducts &&
          (() => {
            // Default products from productsData.json
            const defaultProducts = productsData.slice(0, 6).map((product) => ({
              id: product.id,
              productId: product.productId,
              name: product.name,
              brand: product.brand,
              type: product.type,
              category: product.category,
              price: product.price,
              currencyCode: product.currencyCode,
              image: product.image,
              permalink: product.permalink,
              leftBadge: (product as any).leftBadge,
              rightBadge: (product as any).rightBadge,
              newPrice: (product as any).newPrice,
            }));

            // Use relatedProducts if it has products, otherwise use defaults
            const hasSelectedProducts =
              relatedProducts?.selectedProducts &&
              relatedProducts.selectedProducts.length > 0;
            const productSelection = hasSelectedProducts
              ? relatedProducts
              : {
                  selectionMode: "manual" as const,
                  selectedProducts: defaultProducts,
                  filters: {},
                  maxProducts: 4,
                };

            return (
              <div className="mt-16">
                <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
                <ProductGridBlock
                  productSelection={productSelection}
                  gridColumns={6}
                  showCategory={true}
                  showPrice={true}
                  showButtons={true}
                  buttonLayout="horizontal"
                />
              </div>
            );
          })()}
      </div>
    </div>
  );
}
