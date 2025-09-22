"use client";

import { useThemeConfig } from "../hooks/use-theme-config";
import { DynamicThemeProvider } from "./dynamic-theme-provider";
import { useSearchParams } from "next/navigation";

interface ShopThemeWrapperProps {
  children: React.ReactNode;
}

export function ShopThemeWrapper({ children }: ShopThemeWrapperProps) {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId") || "1"; // Get shop ID from URL or use default

  const { themeConfig, loading, error } = useThemeConfig({ shopId });

  if (loading) {
    return null;
  }

  if (error || !themeConfig) {
    // Fallback to default theme or show error
    return <>{children}</>;
  }

  return (
    <DynamicThemeProvider themeConfig={themeConfig}>
      {children}
    </DynamicThemeProvider>
  );
}
