"use client";

import React from "react";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface ContainerBlockProps {
  width?: "full" | "container" | "narrow" | "wide";
  maxWidth?: string;
  direction?: "row" | "column";
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  gap?: SpacingValue;
  backgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
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
  border?: {
    width?: string;
    style?: "solid" | "dashed" | "dotted";
    color?: string;
  };
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: React.ReactNode;
  items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  spacing?: {
    x?: string;
    y?: string;
  };
}

export function ContainerBlock({
  width = "container",
  maxWidth,
  direction = "column",
  padding = {},
  margin = {},
  gap = {},
  backgroundColor,
  backgroundImage,
  backgroundSize = "cover",
  backgroundPosition = "center",
  borderRadius,
  border,
  shadow = "none",
  className = "",
  children,
  items,
  spacing = { x: "0", y: "0" },
}: ContainerBlockProps) {
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

  const buildGap = React.useMemo(() => {
    const gapObj = gap || {};
    // For flex gap, we use the 'all' value or fallback to spacing values
    return (
      gapObj.all ||
      gapObj.top ||
      gapObj.right ||
      gapObj.bottom ||
      gapObj.left ||
      (direction === "row"
        ? spacing.x || spacing.y || "0"
        : spacing.y || spacing.x || "0")
    );
  }, [gap, direction, spacing]);

  const buildPadding = React.useMemo(() => {
    return {
      paddingTop: padding.top || "0",
      paddingRight: padding.right || "0",
      paddingBottom: padding.bottom || "0",
      paddingLeft: padding.left || "0",
    };
  }, [padding]);

  const buildMargin = React.useMemo(() => {
    return {
      marginTop: margin.top || "0",
      marginRight: margin.right || "auto",
      marginBottom: margin.bottom || "0",
      marginLeft: margin.left || "auto",
    };
  }, [margin]);

  const containerStyles: React.CSSProperties = {
    // if width is narrow, then maxWidth is 768px
    // if width is wide, then maxWidth is 1400px
    // if width is container, then maxWidth is 1200px
    // if width is full, then maxWidth is 100%
    maxWidth:
      maxWidth ||
      (width === "narrow"
        ? "768px"
        : width === "wide"
          ? "1400px"
          : width === "container"
            ? "1280px"
            : "100%"),
    ...buildPadding,
    ...buildMargin,
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: "no-repeat",
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    border: border
      ? `${border.width || "1px"} ${border.style || "solid"} ${border.color || "#000"}`
      : undefined,
    boxShadow:
      shadow === "none"
        ? undefined
        : shadow === "sm"
          ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
          : shadow === "md"
            ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
            : shadow === "lg"
              ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
              : "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    ...(((gap && (gap.all || gap.top || gap.right || gap.bottom || gap.left)) ||
      spacing.x ||
      spacing.y) && {
      display: "flex",
      flexDirection: direction,
      gap: buildGap,
    }),
  };

  console.log("ContainerBlock - items:", items, "children:", children);

  // Render items from the array
  const renderItems = () => {
    if (!items || items.length === 0) {
      // Show placeholder when empty
      return (
        <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-sm text-gray-400">Drop components here</span>
        </div>
      );
    }

    // Render items from the array
    return items.map((item, index) => {
      const content =
        typeof item.content === "function" ? item.content() : item.content;

      // If content is null or empty, show placeholder
      if (!content) {
        return (
          <div
            key={index}
            className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center"
          >
            <span className="text-sm text-gray-400">Drop components here</span>
          </div>
        );
      }

      return <React.Fragment key={index}>{content}</React.Fragment>;
    });
  };

  return (
    <div className={`container-block ${className}`} style={containerStyles}>
      {children}
      {renderItems()}
    </div>
  );
}
