"use client";

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

interface ButtonBlockProps {
  text: string;
  href?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  disabled?: boolean;
  backgroundColor?: {
    colorKey: string;
    customColor?: string;
  };
  textColor?: {
    colorKey: string;
    customColor?: string;
  };
  margin?: SpacingValue;
  padding?: SpacingValue;
  className?: string;
}

export function ButtonBlock({
  text,
  href,
  variant = "default",
  size = "default",
  asChild = false,
  disabled = false,
  backgroundColor,
  textColor,
  margin,
  padding,
  className = "",
}: ButtonBlockProps) {
  const { themeConfig } = useThemeConfig();

  // Build spacing
  const buildSpacing = (spacing?: SpacingValue) => {
    if (!spacing) return {};
    if (spacing.all) {
      return { padding: spacing.all };
    }
    return {
      paddingTop: spacing.top,
      paddingRight: spacing.right,
      paddingBottom: spacing.bottom,
      paddingLeft: spacing.left,
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

  // Resolve colors
  const resolvedBackgroundColor = backgroundColor
    ? resolveColor(
        backgroundColor.colorKey,
        backgroundColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  const resolvedTextColor = textColor
    ? resolveColor(
        textColor.colorKey,
        textColor.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

  const customStyles = {
    ...buildMargin(margin),
    ...buildSpacing(padding),
    ...(resolvedBackgroundColor && {
      backgroundColor: resolvedBackgroundColor,
    }),
    ...(resolvedTextColor && { color: resolvedTextColor }),
  };

  if (href) {
    return (
      <Button
        variant={variant}
        size={size}
        asChild={true}
        disabled={disabled}
        className={className}
        style={customStyles}
      >
        <a href={href}>{text}</a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      asChild={asChild}
      disabled={disabled}
      className={className}
      style={customStyles}
    >
      {text}
    </Button>
  );
}
