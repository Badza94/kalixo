"use client";

import { cn } from "@workspace/ui/lib/utils";

interface TextBlockProps {
  text: string;
  className?: string;
  align?: "left" | "center" | "right" | "justify";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?:
    | "default"
    | "muted"
    | "primary"
    | "secondary"
    | "accent"
    | "destructive";
  leading?: "tight" | "snug" | "normal" | "relaxed" | "loose";
  as?: "p" | "span" | "div";
}

export function TextBlock({
  text,
  className,
  align = "left",
  size = "md",
  weight = "normal",
  color = "default",
  leading = "normal",
  as: Component = "p",
}: TextBlockProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
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
    justify: "text-justify",
  };

  const leadingClasses = {
    tight: "leading-tight",
    snug: "leading-snug",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-loose",
  };

  const baseClasses = cn(
    "block",
    alignClasses[align],
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    leadingClasses[leading],
    className
  );

  return <Component className={baseClasses}>{text}</Component>;
}
