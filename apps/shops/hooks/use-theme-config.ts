import { useState, useEffect } from "react";

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
}

export function useThemeConfig({ shopId = "1" }: { shopId?: string }) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchThemeConfig() {
      try {
        setLoading(true);

        // Replace with your actual CMS API endpoint
        const response = await fetch(`/api/shops/${shopId}/theme`);

        if (!response.ok) {
          throw new Error("Failed to fetch theme configuration");
        }

        const config = await response.json();
        setThemeConfig(config);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));

        // Fallback to default theme
        setThemeConfig({
          light: {
            background: "oklch(1.00 0 0)",
            foreground: "oklch(0.23 0 0)",
            primary: "oklch(0.37 0.14 323.40)",
            // ... add default values
          },
          dark: {
            background: "oklch(0.23 0.01 260.69)",
            foreground: "oklch(0.93 0 0)",
            primary: "oklch(0.58 0.14 327.21)",
            // ... add default values
          },
          fonts: {
            "font-sans": "Lato, sans-serif",
            "font-serif": "Merriweather, serif",
            "font-mono": "Roboto Mono, monospace",
          },
          radius: "0.5rem",
          shadows: {
            "shadow-sm": "0 1px 3px 0px oklch(0.00 0 0 / 0.10)",
            // ... add shadow values
          },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchThemeConfig();
  }, [shopId]);

  return { themeConfig, loading, error };
}
