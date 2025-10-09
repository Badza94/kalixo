"use client";

import Image from "next/image";
import { AspectRatio } from "@workspace/ui/components/aspect-ratio";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2" | "21/9" | "custom" | "auto";
  customAspectRatio?: string;
  fill?: boolean;
  maxWidth?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top left"
    | "top right"
    | "bottom left"
    | "bottom right";
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
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  margin?: SpacingValue;
  opacity?: string;
  grayscale?: boolean;
  priority?: boolean;
  quality?: number;
  className?: string;
}

export function ImageBlock({
  src,
  alt,
  width = 800,
  height = 600,
  aspectRatio = "auto",
  customAspectRatio,
  fill = false,
  maxWidth = "100%",
  objectFit = "cover",
  objectPosition = "center",
  borderRadius,
  shadow = "none",
  margin,
  opacity,
  grayscale = false,
  priority = false,
  quality = 75,
  className = "",
}: ImageBlockProps) {
  // Build margin
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

  // Build filter string
  const filters = [];
  if (grayscale) filters.push("grayscale(100%)");

  // Resolve aspect ratio
  const aspectRatioMap = {
    "16/9": 16 / 9,
    "4/3": 4 / 3,
    "1/1": 1,
    "3/2": 3 / 2,
    "21/9": 21 / 9,
    auto: undefined,
  };

  const resolvedAspectRatio =
    aspectRatio === "custom" && customAspectRatio
      ? parseFloat(customAspectRatio)
      : aspectRatio !== "custom" && aspectRatio !== "auto"
        ? aspectRatioMap[aspectRatio]
        : undefined;

  const containerStyles: React.CSSProperties = {
    ...buildMargin(margin),
    maxWidth,
    width: fill ? "100%" : undefined,
  };

  const imageWrapperStyles: React.CSSProperties = {
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    ...(shadow &&
      shadow !== "none" && {
        boxShadow:
          shadow === "sm"
            ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            : shadow === "md"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              : shadow === "lg"
                ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                : shadow === "xl"
                  ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                  : "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      }),
    overflow: "hidden",
  };

  const imageStyles: React.CSSProperties = {
    ...(opacity && { opacity }),
    ...(filters.length > 0 && { filter: filters.join(" ") }),
    ...(resolvedAspectRatio && { width: "100%", height: "100%" }),
  };

  const content = (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      style={{
        objectFit,
        objectPosition,
        ...imageStyles,
      }}
      priority={priority}
      quality={quality}
      sizes={maxWidth || "100vw"}
    />
  );

  // Use AspectRatio if specified
  if (resolvedAspectRatio !== undefined && !fill) {
    return (
      <div style={containerStyles} className={className}>
        <AspectRatio
          ratio={resolvedAspectRatio as number}
          style={imageWrapperStyles}
        >
          {content}
        </AspectRatio>
      </div>
    );
  }

  // Without aspect ratio
  return (
    <div style={containerStyles} className={className}>
      <div
        style={{
          ...imageWrapperStyles,
          position: fill ? "relative" : undefined,
          ...(fill && { minHeight: "400px" }),
        }}
      >
        {content}
      </div>
    </div>
  );
}
