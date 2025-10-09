"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig } from "../types/theme";

interface ThemeContextType {
  themeConfig: ThemeConfig | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchThemeConfig = async () => {
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
  };

  useEffect(() => {
    fetchThemeConfig();
  }, []);

  const value: ThemeContextType = {
    themeConfig,
    loading,
    error,
    refetch: fetchThemeConfig,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeConfig(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a ThemeProvider");
  }
  return context;
}
