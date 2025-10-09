"use client";

import { cn } from "@workspace/ui/lib/utils";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface HeadingBlockProps {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text: string;
  className?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: {
    colorKey: string;
    customColor?: string;
  };
  backgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  margin?: SpacingValue;
  padding?: SpacingValue;
  fontFamily?: string;
  customFontFamily?: string;
  lineHeight?: string;
  customLineHeight?: string;
  letterSpacing?: string;
  customLetterSpacing?: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through" | "overline";
  opacity?: string;
  customOpacity?: string;
}

export function HeadingBlock({
  level,
  text,
  className,
  align = "left",
  size,
  weight = "bold",
  color,
  backgroundColor,
  margin,
  padding,
  fontFamily,
  customFontFamily,
  lineHeight,
  customLineHeight,
  letterSpacing,
  customLetterSpacing,
  textTransform,
  textDecoration,
  opacity,
  customOpacity,
}: HeadingBlockProps) {
  const { themeConfig } = useThemeConfig();

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const baseClasses = cn(
    "block",
    alignClasses[align],
    sizeClasses[
      size ||
        (level === "h1"
          ? "4xl"
          : level === "h2"
            ? "3xl"
            : level === "h3"
              ? "2xl"
              : "xl")
    ],
    weightClasses[weight],
    className
  );

  // Helper to build spacing CSS
  const buildSpacing = (spacing?: SpacingValue) => {
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

  // Resolve colors from theme or use custom
  const resolvedColor = color
    ? resolveColor(
        color.colorKey,
        color.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  const resolvedBackgroundColor = backgroundColor
    ? resolveColor(
        backgroundColor.colorKey,
        backgroundColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  // Resolve font family
  const resolvedFontFamily =
    fontFamily === "custom" && customFontFamily
      ? customFontFamily
      : fontFamily === "font-sans"
        ? themeConfig?.fonts["font-sans"] || "sans-serif"
        : fontFamily === "font-serif"
          ? themeConfig?.fonts["font-serif"] || "serif"
          : fontFamily === "font-mono"
            ? themeConfig?.fonts["font-mono"] || "monospace"
            : undefined;

  const customStyles = {
    ...buildMargin(margin),
    ...buildSpacing(padding),
    ...(resolvedColor && { color: resolvedColor }),
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedFontFamily && { fontFamily: resolvedFontFamily }),
    ...(lineHeight && lineHeight !== "custom" && { lineHeight }),
    ...(customLineHeight && { lineHeight: customLineHeight }),
    ...(letterSpacing && letterSpacing !== "custom" && { letterSpacing }),
    ...(customLetterSpacing && { letterSpacing: customLetterSpacing }),
    ...(textTransform && textTransform !== "none" && { textTransform }),
    ...(textDecoration && textDecoration !== "none" && { textDecoration }),
    ...(opacity && opacity !== "custom" && { opacity }),
    ...(customOpacity && { opacity: customOpacity }),
  };

  const HeadingTag = level;

  return (
    <HeadingTag className={baseClasses} style={customStyles}>
      {text}
    </HeadingTag>
  );
}
