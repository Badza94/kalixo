// Server Component - No client-side interactivity needed
import React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface CustomHtmlBlockProps {
  html: string;
  margin?: SpacingValue;
  padding?: SpacingValue;
  className?: string;
}

export function CustomHtmlBlock({
  html = "",
  margin,
  padding,
  className = "",
}: CustomHtmlBlockProps) {
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

  // Build padding
  const buildPadding = (spacing?: SpacingValue) => {
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

  const containerStyles: React.CSSProperties = {
    ...buildMargin(margin),
    ...buildPadding(padding),
  };

  // If no HTML is provided, show a placeholder in builder
  if (!html || html.trim() === "") {
    return (
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400",
          className
        )}
        style={containerStyles}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <p className="text-sm font-medium">Custom HTML Block</p>
        <p className="text-xs mt-1">
          Add your custom HTML code in the properties panel
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("custom-html-block", className)}
      style={containerStyles}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

