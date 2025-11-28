"use client";

import { useTheme } from "next-themes";

type ThemeMode = "light" | "dark";

export function useThemeMode(): ThemeMode {
  const { resolvedTheme } = useTheme();
  return (resolvedTheme as ThemeMode) || "light";
}
