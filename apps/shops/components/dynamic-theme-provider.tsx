"use client";

import { useEffect } from "react";

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
}

interface DynamicThemeProviderProps {
  themeConfig: ThemeConfig;
  children: React.ReactNode;
}

export function DynamicThemeProvider({
  themeConfig,
  children,
}: DynamicThemeProviderProps) {
  useEffect(() => {
    // Remove existing dynamic theme style if it exists
    const existingStyle = document.getElementById("dynamic-theme");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create CSS string for light theme
    const lightVars = Object.entries(themeConfig.light)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join("\n");

    // Create CSS string for dark theme
    const darkVars = Object.entries(themeConfig.dark)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join("\n");

    // Create CSS string for fonts and other global vars
    const globalVars = [
      ...Object.entries(themeConfig.fonts).map(
        ([key, value]) => `  --${key}: ${value};`
      ),
      `  --radius: ${themeConfig.radius};`,
      ...Object.entries(themeConfig.shadows).map(
        ([key, value]) => `  --${key}: ${value};`
      ),
    ].join("\n");

    // Create the full CSS with @theme inline for Tailwind v4
    const cssContent = `
:root {
${lightVars}
${globalVars}
}

.dark {
${darkVars}
${Object.entries(themeConfig.shadows)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join("\n")}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
`;

    // Create and inject the style element
    const styleElement = document.createElement("style");
    styleElement.id = "dynamic-theme";
    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);
  }, [themeConfig]);

  return <>{children}</>;
}
