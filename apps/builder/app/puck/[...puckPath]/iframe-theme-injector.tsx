"use client";

import { useEffect, useState } from "react";
import { applyThemeToDocument } from "../../../lib/apply-theme";

interface IframeThemeInjectorProps {
  children: React.ReactNode;
  document?: Document;
  themeConfig: any;
}

export function IframeThemeInjector({
  children,
  document: iframeDocument,
  themeConfig,
}: IframeThemeInjectorProps) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Load theme mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme-mode") as "light" | "dark" | null;
    const initialTheme = stored || "light";
    setThemeMode(initialTheme);
  }, []);

  // Listen for theme mode changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme-mode") {
        const newMode = (e.newValue || "light") as "light" | "dark";
        setThemeMode(newMode);
      }
    };

    // Listen for custom event from ThemeToggle
    const handleThemeChange = (e: CustomEvent) => {
      setThemeMode(e.detail as "light" | "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("theme-mode-change", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("theme-mode-change", handleThemeChange as EventListener);
    };
  }, []);

  // Apply theme whenever the iframe document, theme config, or theme mode changes
  useEffect(() => {
    if (iframeDocument && themeConfig) {
      // Apply theme mode to iframe first
      if (iframeDocument.documentElement) {
        iframeDocument.documentElement.setAttribute("data-theme", themeMode);
      }
      // Then apply theme config (mode is handled via [data-theme] attribute)
      applyThemeToDocument(iframeDocument, themeConfig);
    }
  }, [iframeDocument, themeConfig, themeMode]);

  return <>{children}</>;
}
