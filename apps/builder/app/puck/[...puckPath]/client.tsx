"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Data } from "@measured/puck";
import { Button, Puck } from "@measured/puck";
import config from "../../../puck.config";
import { Eye, Palette, PlusCircle, Layers } from "@workspace/ui/lucide-react";
import { ThemeEditor } from "./theme-editor";
import { Toaster } from "@workspace/ui/components/sonner";
import { IframeThemeInjector } from "./iframe-theme-injector";
import { ThemeProvider } from "../../../contexts/theme-context";
import { EmptyCanvasOverlay } from "../../../components/empty-canvas-overlay";
import { TemplateSelectorDialog } from "../../../components/template-selector-dialog";
import { NewPageDialog } from "../../../components/new-page-dialog";
import { GlobalComponentsManager } from "../../../components/global-components-manager";

interface ThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
  radius: string;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
}

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  const router = useRouter();
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [isGlobalsManagerOpen, setIsGlobalsManagerOpen] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [currentData, setCurrentData] = useState<Partial<Data>>(data);
  const [existingPaths, setExistingPaths] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [puckKey, setPuckKey] = useState(0);

  // Use ref to access latest currentData without causing overrides to recreate
  const currentDataRef = useRef(currentData);
  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  const isHomePage = path === "/";

  // Track when component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Derive page title from currentData in real-time
  const pageTitle = useMemo(() => {
    if (isHomePage) {
      return "Home";
    }

    if (
      currentData?.root?.props &&
      typeof currentData.root.props === "object" &&
      "title" in currentData.root.props &&
      typeof currentData.root.props.title === "string"
    ) {
      return currentData.root.props.title;
    }

    // Fallback: derive from path
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";
    const formatted = lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formatted || "Page";
  }, [currentData, isHomePage, path]);

  // Check if canvas is empty (initial check)
  const initialIsEmpty = useMemo(() => {
    if (!isHomePage) {
      return false;
    }

    if (!data) return true;
    if (
      !data.content ||
      !Array.isArray(data.content) ||
      data.content.length === 0
    ) {
      return true;
    }
    return false;
  }, [data, isHomePage]);

  const [showOverlay, setShowOverlay] = useState(initialIsEmpty);

  useEffect(() => {
    if (isHomePage) {
      setShowOverlay(initialIsEmpty);
    } else {
      setShowOverlay(false);
    }
  }, [initialIsEmpty, isHomePage]);

  useEffect(() => {
    fetch("/puck/api")
      .then((res) => res.json())
      .then((payload) => {
        if (Array.isArray(payload.paths)) {
          const onlyStrings = payload.paths.filter(
            (value: unknown): value is string => typeof value === "string"
          );
          setExistingPaths(onlyStrings);
        }
      })
      .catch((error) => {
        console.error("Failed to load existing page paths:", error);
      });
  }, []);

  useEffect(() => {
    setExistingPaths((prev) => {
      if (prev.includes(path)) {
        return prev;
      }
      return [...prev, path];
    });
  }, [path]);

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

  const shouldShowOverlay = isHomePage && isCanvasEmpty && showOverlay;

  // Fetch theme config on mount
  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((config) => setThemeConfig(config))
      .catch((err) => console.error("Failed to load theme:", err));
  }, []);

  // Hide overlay when content is added
  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    if (!isCanvasEmpty) {
      setShowOverlay(false);
    }
  }, [isCanvasEmpty, isHomePage]);

  // Handle real-time theme updates from the editor
  const handleThemeChange = (newConfig: ThemeConfig) => {
    setThemeConfig(newConfig);
  };

  const overrides = useMemo(
    () => ({
      headerActions: ({ children }: { children: React.ReactNode }) => (
        <>
          <Button
            variant="primary"
            size="medium"
            onClick={() => setIsNewPageDialogOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            New Page
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => setIsGlobalsManagerOpen(true)}
          >
            <Layers className="w-4 h-4" />
            Templates
          </Button>

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
      fieldLabel: ({
        children,
        label,
        icon,
        el = "label",
        className,
      }: {
        children?: React.ReactNode;
        icon?: React.ReactNode;
        label: string;
        el?: "label" | "div";
        readOnly?: boolean;
        className?: string;
      }) => {
        // Only override the root "Page" label
        if (label === "Page") {
          const Component = el;
          // Read title directly from ref at render time (no re-render when typing)
          const currentTitle = (() => {
            if (isHomePage) return "Home";
            const data = currentDataRef.current;
            if (
              data?.root?.props &&
              typeof data.root.props === "object" &&
              "title" in data.root.props &&
              typeof data.root.props.title === "string"
            ) {
              return data.root.props.title;
            }
            const segments = path.split("/").filter(Boolean);
            const lastSegment = segments[segments.length - 1] || "";
            const formatted = lastSegment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            return formatted || "Page";
          })();

          return (
            <Component className={className}>
              <div className="flex gap-2 items-center">
                {icon}
                <span className="font-semibold">{currentTitle}</span>
              </div>
            </Component>
          );
        }
        const Component = el;
        return (
          <Component className={className}>
            <div className="flex gap-2 items-center">
              {icon}
              <span>{label}</span>
            </div>
            {children}
          </Component>
        );
      },
    }),
    [themeConfig, isHomePage, path]
  );

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

  const handleCreatePage = async ({
    name,
    path: targetPath,
  }: {
    name: string;
    path: string;
  }) => {
    const trimmed = targetPath.trim();
    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    const dedupedSlashes = withLeadingSlash.replace(/\/{2,}/g, "/");
    const cleaned =
      dedupedSlashes.length > 1 && dedupedSlashes.endsWith("/")
        ? dedupedSlashes.slice(0, -1)
        : dedupedSlashes;

    // Create initial page data with title
    const initialData = {
      root: { props: { title: name.trim() } },
      content: [],
      zones: {},
    };

    // Save the initial page with title
    await fetch("/puck/api", {
      method: "post",
      body: JSON.stringify({
        data: initialData,
        path: cleaned,
        title: name.trim(),
      }),
    });

    setExistingPaths((prev) => {
      if (prev.includes(cleaned)) {
        return prev;
      }
      return [...prev, cleaned];
    });

    setIsNewPageDialogOpen(false);
    const editPath = cleaned.endsWith("/edit") ? cleaned : `${cleaned}/edit`;
    router.push(editPath);
  };

  const handleSaveTemplate = async (template: {
    name: string;
    components: Array<{
      type: string;
      props: Record<string, unknown>;
    }>;
  }) => {
    await fetch("/puck/api/templates", {
      method: "post",
      body: JSON.stringify(template),
    });
  };

  const handleInsertTemplate = (
    components: Array<{
      type: string;
      props: Record<string, unknown>;
    }>
  ) => {
    console.log("Inserting template with components:", components.length);
    console.log("Current content before:", currentData.content?.length || 0);

    // Append components to current content
    setCurrentData((prev) => {
      const updatedContent = [...(prev.content || []), ...components];
      const updatedData = {
        ...prev,
        content: updatedContent,
      };
      console.log(
        "Inserting template, new content length:",
        updatedData.content?.length
      );
      return updatedData;
    });

    // Force Puck to remount with new data
    setPuckKey((prev) => prev + 1);

    // Close the dialog after a brief delay to ensure state update is processed
    setTimeout(() => {
      setIsGlobalsManagerOpen(false);
    }, 100);
  };

  const handleDeleteTemplate = async (id: string) => {
    await fetch(`/puck/api/templates?id=${id}`, {
      method: "delete",
    });
  };

  return (
    <ThemeProvider>
      <div className="relative" suppressHydrationWarning>
        <Puck
          key={isMounted ? `puck-${path}-${puckKey}` : `puck-${path}`}
          config={config}
          data={currentData}
          overrides={overrides}
          onChange={(newData) => {
            console.log(
              "Puck onChange, content length:",
              newData.content?.length
            );
            setCurrentData(newData);
          }}
          onPublish={async (data) => {
            await fetch("/puck/api", {
              method: "post",
              body: JSON.stringify({
                data,
                path,
                title: pageTitle,
              }),
            });
          }}
        />
        {shouldShowOverlay && (
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
      <NewPageDialog
        isOpen={isNewPageDialogOpen}
        onClose={() => setIsNewPageDialogOpen(false)}
        onCreate={handleCreatePage}
        existingPaths={existingPaths}
      />
      <GlobalComponentsManager
        isOpen={isGlobalsManagerOpen}
        onClose={() => setIsGlobalsManagerOpen(false)}
        currentPageContent={currentData.content || []}
        onSaveTemplate={handleSaveTemplate}
        onInsertTemplate={handleInsertTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />

      <Toaster />
    </ThemeProvider>
  );
}
