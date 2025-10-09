"use client";

import { Render } from "@measured/puck";
import { useEffect } from "react";
import config from "../puck.config";
import type { Data } from "@measured/puck";
import { applyThemeToDocument } from "../lib/apply-theme";
import { ThemeProvider } from "../contexts/theme-context";

interface ClientRenderProps {
  data: Data;
}

export function ClientRender({ data }: ClientRenderProps) {
  // Fetch and apply theme on mount
  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((themeConfig) => {
        applyThemeToDocument(document, themeConfig);
      })
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  return (
    <ThemeProvider>
      <Render config={config} data={data} />
    </ThemeProvider>
  );
}
