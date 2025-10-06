"use client";

import { useState, useEffect } from "react";
import type { Data } from "@measured/puck";
import { Button, Puck } from "@measured/puck";
import config from "../../../puck.config";
import { Eye, Palette } from "@workspace/ui/lucide-react";
import { ThemeEditor } from "./theme-editor";
import { Toaster } from "@workspace/ui/components/sonner";
import { IframeThemeInjector } from "./iframe-theme-injector";

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
}

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);

  // Fetch theme config on mount
  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((config) => setThemeConfig(config))
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  // Handle real-time theme updates from the editor
  const handleThemeChange = (newConfig: ThemeConfig) => {
    setThemeConfig(newConfig);
  };

  const overrides = {
    headerActions: ({ children }: { children: React.ReactNode }) => (
      <>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => setIsThemeEditorOpen(true)}
        >
          <Palette className="w-4 h-4" />
          Theme
        </Button>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => {
            window.open(`/`, "_blank");
          }}
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        {children}
      </>
    ),
    iframe: ({
      children,
      document,
    }: {
      children: React.ReactNode;
      document?: Document;
    }) => (
      <IframeThemeInjector document={document} themeConfig={themeConfig}>
        {children}
      </IframeThemeInjector>
    ),
  };

  return (
    <>
      <Puck
        config={config}
        data={data}
        overrides={overrides}
        onPublish={async (data) => {
          await fetch("/puck/api", {
            method: "post",
            body: JSON.stringify({ data, path }),
          });
        }}
      />
      <ThemeEditor
        isOpen={isThemeEditorOpen}
        onClose={() => setIsThemeEditorOpen(false)}
        onThemeChange={handleThemeChange}
      />
      <Toaster />
    </>
  );
}
