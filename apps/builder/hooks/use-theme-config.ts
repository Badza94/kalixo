"use client";

import { useEffect, useState } from "react";
import { ThemeConfig } from "../types/theme";

interface UseThemeConfigReturn {
  themeConfig: ThemeConfig | null;
  loading: boolean;
  error: Error | null;
}

export function useThemeConfig(): UseThemeConfigReturn {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchThemeConfig() {
      try {
        setLoading(true);
        const response = await fetch("/api/theme");

        if (!response.ok) {
          throw new Error("Failed to fetch theme config");
        }

        const data = await response.json();
        setThemeConfig(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        setThemeConfig(null);
      } finally {
        setLoading(false);
      }
    }

    fetchThemeConfig();
  }, []);

  return { themeConfig, loading, error };
}
