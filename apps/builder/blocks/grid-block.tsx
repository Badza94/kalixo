// Server Component - Uses CSS variables for theming
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { resolveColorServer } from "../types/theme-server";

export interface GridBlockProps {
  columns: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  columns2xl?: number;
  gap: "none" | "sm" | "md" | "lg" | "xl";
  maxWidth?: string;
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
  items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
}

export function GridBlock({
  columns,
  columnsSm,
  columnsMd,
  columnsLg,
  columnsXl,
  columns2xl,
  gap = "md",
  maxWidth,
  margin,
  backgroundColor,
  borderRadius,
  className,
  items,
}: GridBlockProps) {
  // Resolve background color using server-safe function (returns CSS variables)
  const resolvedBackgroundColor = backgroundColor
    ? resolveColorServer(backgroundColor.colorKey, backgroundColor.customColor)
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

  // Generate responsive grid classes
  const getGridClasses = () => {
    const base =
      gridColsClasses[columns as keyof typeof gridColsClasses] || "grid-cols-1";

    const responsiveClasses: string[] = [base];

    if (columnsSm !== undefined) {
      responsiveClasses.push(
        `sm:${gridColsClasses[columnsSm as keyof typeof gridColsClasses] || "grid-cols-1"}`
      );
    }

    if (columnsMd !== undefined) {
      responsiveClasses.push(
        `md:${gridColsClasses[columnsMd as keyof typeof gridColsClasses] || "grid-cols-1"}`
      );
    }

    if (columnsLg !== undefined) {
      responsiveClasses.push(
        `lg:${gridColsClasses[columnsLg as keyof typeof gridColsClasses] || "grid-cols-1"}`
      );
    }

    if (columnsXl !== undefined) {
      responsiveClasses.push(
        `xl:${gridColsClasses[columnsXl as keyof typeof gridColsClasses] || "grid-cols-1"}`
      );
    }

    if (columns2xl !== undefined) {
      responsiveClasses.push(
        `2xl:${gridColsClasses[columns2xl as keyof typeof gridColsClasses] || "grid-cols-1"}`
      );
    }

    return responsiveClasses.join(" ");
  };

  const baseClasses = cn(
    "grid min-h-[200px] p-4",
    getGridClasses(),
    gapClasses[gap],
    className
  );

  const gridStyles: React.CSSProperties = {
    ...(maxWidth && { maxWidth }),
    ...(margin && {
      marginTop: margin.top || "0",
      marginRight: margin.right || "0",
      marginBottom: margin.bottom || "0",
      marginLeft: margin.left || "0",
    }),
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
  };

  // Render items from the array
  const renderColumns = () => {
    if (!items || items.length === 0) {
      // Show placeholder columns when empty
      return Array.from({ length: columns }, (_, index) => (
        <div
          key={index}
          className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center"
        >
          <span className="text-sm text-gray-400">Column {index + 1}</span>
        </div>
      ));
    }

    // Render items from the array
    return items.map((item, index) => {
      const content =
        typeof item.content === "function" ? item.content() : item.content;

      if (!content) {
        return (
          <div
            key={index}
            className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center"
          >
            <span className="text-sm text-gray-400">Drop here</span>
          </div>
        );
      }

      return <React.Fragment key={index}>{content}</React.Fragment>;
    });
  };

  return (
    <div className={baseClasses} style={gridStyles}>
      {renderColumns()}
    </div>
  );
}
