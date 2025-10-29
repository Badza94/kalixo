"use client";

import { useState, useEffect, useMemo } from "react";
import type { Data } from "@measured/puck";
import { Button, Puck } from "@measured/puck";
import config from "../../../puck.config";
import { Eye, Palette } from "@workspace/ui/lucide-react";
import { ThemeEditor } from "./theme-editor";
import { Toaster } from "@workspace/ui/components/sonner";
import { IframeThemeInjector } from "./iframe-theme-injector";
import { ThemeProvider } from "../../../contexts/theme-context";
import { EmptyCanvasOverlay } from "../../../components/empty-canvas-overlay";
import { TemplateSelectorDialog } from "../../../components/template-selector-dialog";

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
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [currentData, setCurrentData] = useState<Partial<Data>>(data);

  // Check if canvas is empty (initial check)
  const initialIsEmpty = useMemo(() => {
    if (!data) return true;
    if (
      !data.content ||
      !Array.isArray(data.content) ||
      data.content.length === 0
    ) {
      return true;
    }
    return false;
  }, [data]);

  const [showOverlay, setShowOverlay] = useState(initialIsEmpty);

  // Check if canvas is empty
  const isCanvasEmpty = useMemo(() => {
    if (!currentData) return true;

    // Check if content array is empty or doesn't exist
    if (
      !currentData.content ||
      !Array.isArray(currentData.content) ||
      currentData.content.length === 0
    ) {
      return true;
    }

    // Also check root.props.children if it exists
    if (currentData.root?.props && "children" in currentData.root.props) {
      const children = (currentData.root.props as { children?: unknown[] })
        .children;
      if (!children || !Array.isArray(children) || children.length === 0) {
        return true;
      }
    }

    // If content exists and has items, canvas is not empty
    return false;
  }, [currentData]);

  // Fetch theme config on mount
  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((config) => setThemeConfig(config))
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  // Hide overlay when content is added
  useEffect(() => {
    if (!isCanvasEmpty) {
      setShowOverlay(false);
    }
  }, [isCanvasEmpty]);

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

  const handleSelectTemplate = () => {
    setIsTemplateDialogOpen(true);
  };

  const handleTemplateSelected = (templateId: string) => {
    // TODO: Load template data based on templateId
    // For now, just hide the overlay and allow user to build
    setShowOverlay(false);
    console.log("Template selected:", templateId);
  };

  const handleCreateOwn = () => {
    // Hide the overlay when user clicks "Start Building"
    setShowOverlay(false);
  };

  return (
    <ThemeProvider>
      <div className="relative">
        <Puck
          config={config}
          data={currentData}
          overrides={overrides}
          onChange={(newData) => {
            setCurrentData(newData);
          }}
          onPublish={async (data) => {
            await fetch("/puck/api", {
              method: "post",
              body: JSON.stringify({ data, path }),
            });
          }}
        />
        {isCanvasEmpty && showOverlay && (
          <EmptyCanvasOverlay
            onSelectTemplate={handleSelectTemplate}
            onCreateOwn={handleCreateOwn}
          />
        )}
      </div>
      <ThemeEditor
        isOpen={isThemeEditorOpen}
        onClose={() => setIsThemeEditorOpen(false)}
        onThemeChange={handleThemeChange}
      />
      <TemplateSelectorDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        onSelectTemplate={handleTemplateSelected}
      />
      <Toaster />
    </ThemeProvider>
  );
}
