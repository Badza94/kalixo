"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { applyThemeToDocument } from "../../../lib/apply-theme";

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
}

interface IframeThemeInjectorProps {
  children: React.ReactNode;
  document?: Document;
  themeConfig: ThemeConfig | null;
}

export function IframeThemeInjector({
  children,
  document: iframeDocument,
  themeConfig,
}: IframeThemeInjectorProps) {
  const { resolvedTheme } = useTheme();

  // Apply theme whenever the iframe document, theme config, or theme mode changes
  useEffect(() => {
    if (iframeDocument && themeConfig && resolvedTheme) {
      // Apply theme mode to iframe first
      if (iframeDocument.documentElement) {
        iframeDocument.documentElement.setAttribute(
          "data-theme",
          resolvedTheme
        );
      }
      // Then apply theme config (mode is handled via [data-theme] attribute)
      applyThemeToDocument(iframeDocument, themeConfig);
    }
  }, [iframeDocument, themeConfig, resolvedTheme]);

  return <>{children}</>;
}
