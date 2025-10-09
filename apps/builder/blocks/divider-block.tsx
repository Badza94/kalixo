"use client";

import { Separator } from "@workspace/ui/components/separator";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface DividerBlockProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  color?: {
    colorKey: string;
    customColor?: string;
  };
  thickness?: string;
  margin?: SpacingValue;
  className?: string;
}

export function DividerBlock({
  orientation = "horizontal",
  decorative = true,
  color,
  thickness,
  margin,
  className = "",
}: DividerBlockProps) {
  const { themeConfig } = useThemeConfig();

  // Resolve color
  const resolvedColor = color
    ? resolveColor(
        color.colorKey,
        color.customColor,
        themeConfig || undefined,
        "light"
      )
    : undefined;

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

  const customStyles = {
    ...buildMargin(margin),
    ...(resolvedColor && { backgroundColor: resolvedColor }),
    ...(thickness && orientation === "horizontal" && { height: thickness }),
    ...(thickness && orientation === "vertical" && { width: thickness }),
  };

  return (
    <Separator
      orientation={orientation}
      decorative={decorative}
      className={className}
      style={customStyles}
    />
  );
}
