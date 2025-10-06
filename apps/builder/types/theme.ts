export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeFonts {
  "font-sans": string;
  "font-serif": string;
  "font-mono": string;
}

export interface ThemeShadows {
  "shadow-2xs": string;
  "shadow-xs": string;
  "shadow-sm": string;
  shadow: string;
  "shadow-md": string;
  "shadow-lg": string;
  "shadow-xl": string;
  "shadow-2xl": string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
  fonts: ThemeFonts;
  radius: string;
  shadows: ThemeShadows;
  spacing: ThemeSpacing;
}

// Helper to get color options for select fields
export function getThemeColorOptions() {
  return [
    { label: "Background", value: "background" },
    { label: "Foreground", value: "foreground" },
    { label: "Primary", value: "primary" },
    { label: "Primary Foreground", value: "primary-foreground" },
    { label: "Secondary", value: "secondary" },
    { label: "Secondary Foreground", value: "secondary-foreground" },
    { label: "Accent", value: "accent" },
    { label: "Accent Foreground", value: "accent-foreground" },
    { label: "Muted", value: "muted" },
    { label: "Muted Foreground", value: "muted-foreground" },
    { label: "Destructive", value: "destructive" },
    { label: "Border", value: "border" },
    { label: "Success", value: "success" },
    { label: "Warning", value: "warning" },
    { label: "Info", value: "info" },
    { label: "Custom", value: "custom" },
  ];
}

// Helper to get spacing options
export function getSpacingOptions(theme?: ThemeConfig) {
  const spacing = theme?.spacing || {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  };

  return [
    { label: "None", value: "0" },
    { label: `XS (${spacing.xs})`, value: spacing.xs },
    { label: `SM (${spacing.sm})`, value: spacing.sm },
    { label: `MD (${spacing.md})`, value: spacing.md },
    { label: `LG (${spacing.lg})`, value: spacing.lg },
    { label: `XL (${spacing.xl})`, value: spacing.xl },
    { label: `2XL (${spacing["2xl"]})`, value: spacing["2xl"] },
    { label: "Custom", value: "custom" },
  ];
}

// Helper to resolve color from theme
export function resolveColor(
  colorKey: string,
  customColor?: string,
  theme?: ThemeConfig,
  mode: "light" | "dark" = "light"
): string {
  if (colorKey === "custom" && customColor) {
    return customColor;
  }

  if (!theme) {
    return colorKey;
  }

  const colors = theme[mode];
  return colors[colorKey as keyof ThemeColors] || colorKey;
}

// Helper to get font family options
export function getFontFamilyOptions(theme?: ThemeConfig) {
  return [
    { label: "Sans Serif", value: "font-sans" },
    { label: "Serif", value: "font-serif" },
    { label: "Monospace", value: "font-mono" },
    { label: "Custom", value: "custom" },
  ];
}

// Helper to get line height options
export function getLineHeightOptions() {
  return [
    { label: "Tight (1.25)", value: "1.25" },
    { label: "Snug (1.375)", value: "1.375" },
    { label: "Normal (1.5)", value: "1.5" },
    { label: "Relaxed (1.625)", value: "1.625" },
    { label: "Loose (2)", value: "2" },
    { label: "Custom", value: "custom" },
  ];
}

// Helper to get letter spacing options
export function getLetterSpacingOptions() {
  return [
    { label: "Tighter (-0.05em)", value: "-0.05em" },
    { label: "Tight (-0.025em)", value: "-0.025em" },
    { label: "Normal (0)", value: "0" },
    { label: "Wide (0.025em)", value: "0.025em" },
    { label: "Wider (0.05em)", value: "0.05em" },
    { label: "Widest (0.1em)", value: "0.1em" },
    { label: "Custom", value: "custom" },
  ];
}

// Helper to get text transform options
export function getTextTransformOptions() {
  return [
    { label: "None", value: "none" },
    { label: "Uppercase", value: "uppercase" },
    { label: "Lowercase", value: "lowercase" },
    { label: "Capitalize", value: "capitalize" },
  ];
}

// Helper to get text decoration options
export function getTextDecorationOptions() {
  return [
    { label: "None", value: "none" },
    { label: "Underline", value: "underline" },
    { label: "Line Through", value: "line-through" },
    { label: "Overline", value: "overline" },
  ];
}

// Helper to get opacity options
export function getOpacityOptions() {
  return [
    { label: "100%", value: "1" },
    { label: "90%", value: "0.9" },
    { label: "80%", value: "0.8" },
    { label: "70%", value: "0.7" },
    { label: "60%", value: "0.6" },
    { label: "50%", value: "0.5" },
    { label: "40%", value: "0.4" },
    { label: "30%", value: "0.3" },
    { label: "20%", value: "0.2" },
    { label: "10%", value: "0.1" },
    { label: "Custom", value: "custom" },
  ];
}
