"use client";

import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import * as LucideIcons from "@workspace/ui/lucide-react";
import { SharedAssets } from "@workspace/ui/assets";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface ButtonBlockProps {
  text: string;
  href?: string;
  icon?: string; // Icon name from lucide-react
  image?: string; // Image URL
  iconPosition?: "left" | "right";
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
  icon,
  image,
  iconPosition = "left",
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

  // Get icon component from lucide-react
  const IconComponent = icon
    ? (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  // Check if image URL is valid
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("data:image")) return true;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
    if (url.startsWith("/")) return true;
    return false;
  };

  const imageSrc =
    image && isValidImageUrl(image) ? image : SharedAssets.placeholder;

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

  const buttonContent = (
    <>
      {icon && IconComponent && iconPosition === "left" && (
        <IconComponent className="w-4 h-4" />
      )}
      {image && iconPosition === "left" && (
        <div className="relative w-4 h-4">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-contain"
            sizes="16px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== SharedAssets.placeholder) {
                target.src = SharedAssets.placeholder;
              }
            }}
          />
        </div>
      )}
      {text ? <span>{text}</span> : null}
      {icon && IconComponent && iconPosition === "right" && (
        <IconComponent className="w-4 h-4" />
      )}
      {image && iconPosition === "right" && (
        <div className="relative w-4 h-4">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-contain"
            sizes="16px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== SharedAssets.placeholder) {
                target.src = SharedAssets.placeholder;
              }
            }}
          />
        </div>
      )}
    </>
  );

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
        <a href={href} className="inline-flex gap-2 items-center">
          {buttonContent}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      asChild={asChild}
      disabled={disabled}
      className={`inline-flex gap-2 items-center ${className}`}
      style={customStyles}
    >
      {buttonContent}
    </Button>
  );
}
