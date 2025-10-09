"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@workspace/ui/components/carousel";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

interface CarouselBlockProps {
  orientation?: "horizontal" | "vertical";
  showNavigation?: boolean;
  loop?: boolean;
  itemsPerSlide?: 1 | 2 | 3 | 4 | 5 | 6;
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
  itemMinHeight?: string;
  itemBackgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  itemPadding?: SpacingValue;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  itemGap?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  items?: Array<{
    contents?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  }>;
}

export function CarouselBlock({
  orientation = "horizontal",
  showNavigation = true,
  loop = true,
  itemsPerSlide = 3,
  backgroundColor,
  borderRadius,
  margin,
  padding,
  itemMinHeight = "300px",
  itemBackgroundColor,
  itemPadding,
  gap = "md",
  itemGap = "md",
  className = "",
  items = [],
}: CarouselBlockProps) {
  const { themeConfig } = useThemeConfig();

  // Resolve background color
  const resolvedBackgroundColor = backgroundColor
    ? resolveColor(
        backgroundColor.colorKey,
        backgroundColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  // Resolve item background color
  const resolvedItemBackgroundColor = itemBackgroundColor
    ? resolveColor(
        itemBackgroundColor.colorKey,
        itemBackgroundColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  // Resolve border radius
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

  const resolvedBorderRadius = borderRadius
    ? borderRadius.size === "custom" && borderRadius.customValue
      ? borderRadius.customValue
      : borderRadius.size !== "custom"
        ? borderRadiusMap[borderRadius.size]
        : undefined
    : undefined;

  // Gap mapping
  const gapMap = {
    none: "0",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  };

  // Build margin
  const buildMargin = (spacing?: SpacingValue) => {
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

  // Build padding
  const buildPadding = (spacing?: SpacingValue) => {
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

  const containerStyles: React.CSSProperties = {
    ...buildMargin(margin),
    ...buildPadding(padding),
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    maxWidth: showNavigation ? "calc(100vw - 8rem)" : "100%",
    margin: "0 auto",
  };

  // Simple render function
  const renderItems = () => {
    if (!items || items.length === 0) {
      return (
        <CarouselItem>
          <div
            className="flex justify-center items-center bg-gray-100 rounded border-2 border-gray-300 border-dashed"
            style={{ minHeight: itemMinHeight }}
          >
            <span className="text-sm text-gray-400">
              Add carousel items below
            </span>
          </div>
        </CarouselItem>
      );
    }

    // Group items into slides
    const slides = [];
    for (let i = 0; i < items.length; i += itemsPerSlide) {
      slides.push(items.slice(i, i + itemsPerSlide));
    }

    return slides.map((slideItems, slideIndex) => (
      <CarouselItem key={slideIndex} style={{ paddingLeft: gapMap[gap] }}>
        <div
          className="flex w-full carousel-item-wrapper"
          style={{
            minHeight: itemMinHeight,
            gap: gapMap[itemGap],
            flexDirection: orientation === "vertical" ? "column" : "row",
            ...(resolvedItemBackgroundColor && {
              backgroundColor: resolvedItemBackgroundColor,
            }),
            ...(resolvedBorderRadius && {
              borderRadius: resolvedBorderRadius,
            }),
            ...buildPadding(itemPadding),
          }}
        >
          {slideItems.map((item, itemIndex) => {
            if (!item) return null;

            const contents = item.contents || [];
            const itemWidth =
              itemsPerSlide > 1 ? `${100 / itemsPerSlide}%` : "100%";

            return (
              <div
                key={itemIndex}
                className="flex flex-col"
                style={{
                  width: orientation === "horizontal" ? itemWidth : "100%",
                  minHeight: itemsPerSlide > 1 ? "200px" : itemMinHeight,
                }}
              >
                {!contents || contents.length === 0 ? (
                  <div className="flex justify-center items-center p-4 min-h-full bg-gray-100 rounded border-2 border-gray-300 border-dashed">
                    <span className="text-sm text-gray-400">
                      Drop components here
                    </span>
                  </div>
                ) : (
                  contents.map((contentItem, contentIndex) => {
                    if (!contentItem) return null;

                    const content =
                      typeof contentItem.content === "function"
                        ? contentItem.content()
                        : contentItem.content;

                    if (!content) {
                      return (
                        <div
                          key={contentIndex}
                          className="flex justify-center items-center p-4 min-h-[100px] bg-gray-50 rounded border-2 border-gray-200 border-dashed"
                        >
                          <span className="text-sm text-gray-400">
                            Drop component here
                          </span>
                        </div>
                      );
                    }

                    return (
                      <React.Fragment key={contentIndex}>
                        {content}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </CarouselItem>
    ));
  };

  return (
    <div className={className} style={containerStyles}>
      <Carousel
        opts={{
          align: "start",
          loop: loop,
        }}
        orientation={orientation}
        className="w-full"
      >
        <CarouselContent
          style={{
            marginLeft: orientation === "horizontal" ? `-${gapMap[gap]}` : "0",
            marginTop: orientation === "vertical" ? `-${gapMap[gap]}` : "0",
          }}
        >
          {renderItems()}
        </CarouselContent>
        {showNavigation && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
