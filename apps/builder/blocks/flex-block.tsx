"use client";

import React from "react";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface FlexBlockProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  align?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  gap?: string;
  width?: string;
  height?: string;
  minHeight?: string;
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
  className?: string;
  children?: React.ReactNode;
  items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
}

export function FlexBlock({
  direction = "row",
  wrap = "nowrap",
  justify = "flex-start",
  align = "stretch",
  gap = "0",
  width = "100%",
  height,
  minHeight,
  padding = {},
  margin = {},
  backgroundColor,
  borderRadius,
  className = "",
  children,
  items,
}: FlexBlockProps) {
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

  const flexStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent: justify,
    alignItems: align,
    gap,
    width,
    height,
    minHeight,
    padding: `${padding.top || "0"} ${padding.right || "0"} ${padding.bottom || "0"} ${padding.left || "0"}`,
    margin: `${margin.top || "0"} ${margin.right || "0"} ${margin.bottom || "0"} ${margin.left || "0"}`,
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
  };

  console.log(
    "FlexBlock - items:",
    items,
    "children:",
    children,
    "items length:",
    items?.length
  );

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
            className="min-h-[100px] min-w-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center flex-1"
            style={{ minWidth: "100px", minHeight: "100px" }}
          >
            <span className="text-sm text-gray-400">Drop components here</span>
          </div>
        );
      }

      return <React.Fragment key={index}>{content}</React.Fragment>;
    });
  };

  return (
    <div
      className={`flex-block ${className}`}
      style={{
        ...flexStyles,
        minHeight: "100px", // Ensure minimum height for drop zones
        position: "relative",
      }}
    >
      {children}
      {renderItems()}
    </div>
  );
}
