"use client";

import { Render } from "@measured/puck";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import config from "../puck.config";
import type { Data } from "@measured/puck";
import { applyThemeToDocument } from "../lib/apply-theme";
import { ThemeProvider } from "../contexts/theme-context";

interface ClientRenderProps {
  data: Data & { dynamicSegment?: string };
}

export function ClientRender({ data }: ClientRenderProps) {
  const pathname = usePathname();
  
  // Fetch and apply theme on mount
  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((themeConfig) => {
        applyThemeToDocument(document, themeConfig);
        // Apply theme mode from localStorage
        const stored = localStorage.getItem("theme-mode") as "light" | "dark" | null;
        const themeMode = stored || "light";
        document.documentElement.setAttribute("data-theme", themeMode);
      })
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  // Extract dynamic segment from pathname if not already in data
  let dynamicSegment = data.dynamicSegment;
  if (!dynamicSegment) {
    if (pathname?.startsWith("/category/")) {
      dynamicSegment = pathname.replace("/category/", "");
    } else if (pathname?.startsWith("/product/")) {
      dynamicSegment = pathname.replace("/product/", "");
    }
  }

  // Inject dynamic segment into root props if it exists
  const enhancedData = { ...data };
  if (dynamicSegment && enhancedData.root?.props) {
    (enhancedData.root.props as Record<string, unknown>).dynamicSegment =
      dynamicSegment;
  }

  return (
    <ThemeProvider>
      <Render config={config} data={enhancedData} />
    </ThemeProvider>
  );
}
