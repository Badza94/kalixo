/**
 * Server-safe theme utilities
 * These don't require React hooks and can be used in Server Components
 * 
 * These functions return CSS variables (var(--colorKey)) instead of actual values.
 * The CSS variables are injected by ClientRender component on mount.
 */

// Helper to resolve color to CSS variable (server-safe)
export function resolveColorServer(
  colorKey: string,
  customColor?: string
): string {
  if (colorKey === "transparent") {
    return "transparent";
  }

  if (colorKey === "glass") {
    return "glass"; // Special value to indicate glass effect
  }

  if (colorKey === "custom" && customColor) {
    return customColor;
  }

  // Valid theme color keys
  const validThemeKeys = [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
    "success",
    "warning",
    "info",
  ];

  if (validThemeKeys.includes(colorKey)) {
    // Return CSS variable - it will automatically switch based on [data-theme]
    // The CSS variables are injected by ClientRender on mount
    return `var(--${colorKey})`;
  }

  // Fallback: return the color key as-is
  return colorKey;
}

// Helper to resolve font family to CSS variable (server-safe)
export function resolveFontFamilyServer(
  fontFamily?: string,
  customFontFamily?: string
): string | undefined {
  if (fontFamily === "custom" && customFontFamily) {
    return customFontFamily;
  }

  if (fontFamily === "font-sans") {
    return "var(--font-sans)";
  }

  if (fontFamily === "font-serif") {
    return "var(--font-serif)";
  }

  if (fontFamily === "font-mono") {
    return "var(--font-mono)";
  }

  return undefined;
}

