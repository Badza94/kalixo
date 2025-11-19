"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { applyThemeToDocument } from "../lib/apply-theme";

type ThemeMode = "light" | "dark";

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);

  // Apply theme to document and iframe
  const applyTheme = (mode: ThemeMode, config?: ThemeConfig | null) => {
    const configToUse = config || themeConfig;
    if (!configToUse) return;

    // Apply to main document
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
      applyThemeToDocument(document, configToUse);
    }

    // Apply to iframe (canvas preview)
    const iframe = document.querySelector("iframe");
    if (iframe?.contentDocument) {
      iframe.contentDocument.documentElement.setAttribute("data-theme", mode);
      applyThemeToDocument(iframe.contentDocument, configToUse);
    }
  };

  // Fetch theme config on mount
  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((config) => {
        setThemeConfig(config);
        // Load theme mode from localStorage
        const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
        const initialTheme = stored || "light";
        setTheme(initialTheme);
        applyTheme(initialTheme, config);
      })
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  // Watch for iframe changes and apply theme
  useEffect(() => {
    if (!themeConfig) return;

    const checkIframe = () => {
      const iframe = document.querySelector("iframe");
      if (iframe?.contentDocument) {
        iframe.contentDocument.documentElement.setAttribute("data-theme", theme);
        applyThemeToDocument(iframe.contentDocument, themeConfig);
      }
    };

    // Check immediately
    checkIframe();

    // Watch for iframe load
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.addEventListener("load", checkIframe);
      return () => iframe.removeEventListener("load", checkIframe);
    }
  }, [theme, themeConfig]);

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme-mode", newTheme);
    applyTheme(newTheme);
    
    // Dispatch custom event for iframe sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("theme-mode-change", { detail: newTheme })
      );
    }
  };

  return (
    <Button
      variant="secondary"
      size="default"
      onClick={toggleTheme}
      className={cn("gap-2")}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </Button>
  );
}

