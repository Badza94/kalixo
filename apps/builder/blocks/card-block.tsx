"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface CardBlockProps {
  showHeader?: boolean;
  title?: string;
  description?: string;
  showFooter?: boolean;
  backgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  borderColor?: {
    colorKey: string;
    customColor?: string;
  };
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  margin?: SpacingValue;
  padding?: SpacingValue;
  className?: string;
  items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  footerItems?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
}

export function CardBlock({
  showHeader = true,
  title = "Card Title",
  description = "Card description",
  showFooter = false,
  backgroundColor,
  borderColor,
  shadow = "none",
  margin,
  padding,
  className = "",
  items,
  footerItems,
}: CardBlockProps) {
  const { themeConfig } = useThemeConfig();

  // Resolve colors
  const resolvedBackgroundColor = backgroundColor
    ? resolveColor(
        backgroundColor.colorKey,
        backgroundColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  const resolvedBorderColor = borderColor
    ? resolveColor(
        borderColor.colorKey,
        borderColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  // Build spacing
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

  const customStyles = {
    ...buildMargin(margin),
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedBorderColor && { borderColor: resolvedBorderColor }),
    ...(shadow &&
      shadow !== "none" && {
        boxShadow:
          shadow === "sm"
            ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            : shadow === "md"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              : shadow === "lg"
                ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                : "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }),
  };

  const contentPadding = padding
    ? padding.all
      ? { padding: padding.all }
      : {
          paddingTop: padding.top,
          paddingRight: padding.right,
          paddingBottom: padding.bottom,
          paddingLeft: padding.left,
        }
    : undefined;

  // Render content items
  const renderItems = (
    itemsArray?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>
  ) => {
    if (!itemsArray || itemsArray.length === 0) {
      return (
        <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-sm text-gray-400">Drop components here</span>
        </div>
      );
    }

    return itemsArray.map((item, index) => {
      const content =
        typeof item.content === "function" ? item.content() : item.content;

      if (!content) {
        return (
          <div
            key={index}
            className="min-h-[50px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center"
          >
            <span className="text-sm text-gray-400">Drop components here</span>
          </div>
        );
      }

      return <React.Fragment key={index}>{content}</React.Fragment>;
    });
  };

  return (
    <Card className={className} style={customStyles}>
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent style={contentPadding}>{renderItems(items)}</CardContent>

      {showFooter && <CardFooter>{renderItems(footerItems)}</CardFooter>}
    </Card>
  );
}
