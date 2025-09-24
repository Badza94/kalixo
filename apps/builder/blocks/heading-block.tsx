"use client";

import { cn } from "@workspace/ui/lib/utils";

interface HeadingBlockProps {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text: string;
  className?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?:
    | "default"
    | "muted"
    | "primary"
    | "secondary"
    | "accent"
    | "destructive";
}

export function HeadingBlock({
  level,
  text,
  className,
  align = "left",
  size,
  weight = "bold",
  color = "default",
}: HeadingBlockProps) {
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

  const colorClasses = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary-foreground",
    accent: "text-accent-foreground",
    destructive: "text-destructive",
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
    colorClasses[color],
    className
  );

  const HeadingTag = level;

  return <HeadingTag className={baseClasses}>{text}</HeadingTag>;
}
