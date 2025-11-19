"use client";

import { useState, useEffect } from "react";

type ThemeMode = "light" | "dark";

export function useThemeMode(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    // Get initial mode from localStorage or document
    const getCurrentMode = (): ThemeMode => {
      if (typeof window === "undefined") return "light";
      
      const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
      if (stored) return stored;
      
      const docMode = document.documentElement.getAttribute("data-theme") as ThemeMode | null;
      if (docMode) return docMode;
      
      return "light";
    };

    setMode(getCurrentMode());

    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setMode(e.detail as ThemeMode);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme-mode") {
        setMode((e.newValue || "light") as ThemeMode);
      }
    };

    // Watch for data-theme attribute changes
    const observer = new MutationObserver(() => {
      const currentMode = document.documentElement.getAttribute("data-theme") as ThemeMode | null;
      if (currentMode && currentMode !== mode) {
        setMode(currentMode);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("theme-mode-change", handleThemeChange as EventListener);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("theme-mode-change", handleThemeChange as EventListener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [mode]);

  return mode;
}

