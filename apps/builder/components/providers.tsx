"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider as ThemeConfigProvider } from "../contexts/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeConfigProvider>{children}</ThemeConfigProvider>
    </NextThemesProvider>
  );
}
