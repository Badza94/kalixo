"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@workspace/ui/components/carousel";
import { Button } from "@workspace/ui/components/button";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface CarouselBlockProps {
  orientation?: "horizontal" | "vertical";
  showNavigation?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
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
  showDots = false,
  showCounter = true,
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Handle carousel API changes
  useEffect(() => {
    if (!api) return;

    const currentCount = api.scrollSnapList().length;
    setCount(currentCount);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);

    // Auto-scroll to last slide when new items are added
    const newSlideCount = Math.ceil(items.length / itemsPerSlide);
    if (newSlideCount > currentCount && currentCount > 0) {
      setTimeout(() => {
        api.scrollTo(newSlideCount - 1);
      }, 100);
    }

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, items.length, itemsPerSlide]);

  // Memoize background color resolution to prevent infinite re-renders
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

  // Memoize item background color resolution
  const resolvedItemBackgroundColor = useMemo(() => {
    return itemBackgroundColor
      ? resolveColor(
          itemBackgroundColor.colorKey,
          itemBackgroundColor.customColor,
          themeConfig || undefined,
          "light"
        )
      : undefined;
  }, [itemBackgroundColor, themeConfig]);

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

  // Memoize gap mapping
  const gapMap = useMemo(
    () => ({
      none: "0",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    }),
    []
  );

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

  const containerStyles: React.CSSProperties = useMemo(
    () => ({
      ...buildMargin(margin),
      ...buildPadding(padding),
      ...(resolvedBackgroundColor && {
        backgroundColor: resolvedBackgroundColor,
      }),
      ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
      maxWidth: showNavigation ? "calc(100vw - 8rem)" : "100%",
      margin: "0 auto",
    }),
    [
      buildMargin,
      buildPadding,
      margin,
      padding,
      resolvedBackgroundColor,
      resolvedBorderRadius,
      showNavigation,
    ]
  );

  // Simple render function
  const renderItems = () => {
    // Calculate how many slides we need
    const totalSlides = Math.max(
      1,
      Math.ceil((items?.length || 0) / itemsPerSlide)
    );

    return Array.from({ length: totalSlides }).map((_, slideIndex) => (
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
          {Array.from({ length: itemsPerSlide }).map((_, itemIndex) => {
            const globalItemIndex = slideIndex * itemsPerSlide + itemIndex;
            const item = items?.[globalItemIndex];
            const contents = item?.contents || [];
            const itemWidth =
              itemsPerSlide > 1 ? `${100 / itemsPerSlide}%` : "100%";

            // Always show a dropzone for each position, regardless of whether the item exists
            // This ensures that slides always have the correct number of dropzones
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
        setApi={setApi}
        opts={{
          align: "start",
          loop: loop,
          dragFree: true,
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

      {/* Dot Indicators */}
      {showDots && count > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`w-2 h-2 p-0 rounded-full transition-all ${
                index === current - 1
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {showCounter && count > 1 && (
        <div className="flex justify-center mt-2">
          <span className="text-sm text-muted-foreground">
            {current} of {count}
          </span>
        </div>
      )}
    </div>
  );
}
