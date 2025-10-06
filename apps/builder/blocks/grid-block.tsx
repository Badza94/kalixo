"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface GridBlockProps {
  columns: number;
  gap: "none" | "sm" | "md" | "lg" | "xl";
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
  items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
}

export function GridBlock({
  columns,
  gap = "md",
  backgroundColor,
  borderRadius,
  className,
  items,
}: GridBlockProps) {
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

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const gridColsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const baseClasses = cn(
    "grid min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg",
    gridColsClasses[columns as keyof typeof gridColsClasses] || "grid-cols-3",
    gapClasses[gap],
    className
  );

  const gridStyles: React.CSSProperties = {
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
  };

  console.log("GridBlock - columns:", columns, "baseClasses:", baseClasses);

  // Render items from the array
  const renderColumns = () => {
    if (!items || items.length === 0) {
      // Show placeholder columns when empty
      return Array.from({ length: columns }, (_, index) => (
        <div
          key={index}
          className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center"
        >
          <span className="text-gray-400 text-sm">Column {index + 1}</span>
        </div>
      ));
    }

    // Render items from the array
    return items.map((item, index) => {
      const content =
        typeof item.content === "function" ? item.content() : item.content;
      return (
        <div key={index} className="min-h-[100px]">
          {content}
        </div>
      );
    });
  };

  return (
    <div className={baseClasses} style={gridStyles}>
      {renderColumns()}
    </div>
  );
}
