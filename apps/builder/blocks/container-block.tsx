"use client";

import React from "react";

interface ContainerBlockProps {
  width?: "full" | "container" | "narrow" | "wide";
  maxWidth?: string;
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
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  borderRadius?: string;
  border?: {
    width?: string;
    style?: "solid" | "dashed" | "dotted";
    color?: string;
  };
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: React.ReactNode;
  items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
}

export function ContainerBlock({
  width = "container",
  maxWidth,
  padding = {},
  margin = {},
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
}: ContainerBlockProps) {
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
            ? "1200px"
            : "100%"),
    margin: "0 auto",
    padding: `${padding.top || "0"} ${padding.right || "0"} ${padding.bottom || "0"} ${padding.left || "0"}`,
    marginTop: margin.top || "0",
    marginRight: margin.right || "0",
    marginBottom: margin.bottom || "0",
    marginLeft: margin.left || "0",
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: "no-repeat",
    borderRadius,
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
  };

  console.log("ContainerBlock - items:", items, "children:", children);

  // Render items from the array
  const renderItems = () => {
    if (!items || items.length === 0) {
      // Show placeholder when empty
      return (
        <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Drop components here</span>
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
            <span className="text-gray-400 text-sm">Drop components here</span>
          </div>
        );
      }

      return content;
    });
  };

  return (
    <div className={`container-block ${className}`} style={containerStyles}>
      {children}
      {renderItems()}
    </div>
  );
}
