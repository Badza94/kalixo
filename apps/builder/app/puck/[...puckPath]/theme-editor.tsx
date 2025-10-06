"use client";

import { useState, useEffect } from "react";
import { X } from "@workspace/ui/lucide-react";
import { Button } from "@measured/puck";
import { toast } from "sonner";
import { hexToOklch, oklchToHex } from "../../../lib/color-utils";

interface ThemeColors {
  [key: string]: string;
}

interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
  fonts: {
    "font-sans": string;
    "font-serif": string;
    "font-mono": string;
  };
  radius: string;
  shadows: {
    [key: string]: string;
  };
  spacing: {
    [key: string]: string;
  };
}

interface ThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeEditor({ isOpen, onClose }: ThemeEditorProps) {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTheme();
    }
  }, [isOpen]);

  const fetchTheme = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/theme");
      const data = await response.json();
      setThemeConfig(data);
    } catch (error) {
      console.error("Failed to fetch theme:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveTheme = async () => {
    if (!themeConfig) return;

    setSaving(true);
    try {
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeConfig),
      });

      if (response.ok) {
        toast.success("Theme saved successfully!", {
          description: "The page will reload to apply changes.",
        });
        // Reload the page to apply changes
      } else {
        toast.error("Failed to save theme", {
          description: "Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
      toast.error("Failed to save theme", {
        description: "An error occurred while saving the theme.",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateColor = (mode: "light" | "dark", key: string, value: string) => {
    if (!themeConfig) return;
    setThemeConfig({
      ...themeConfig,
      [mode]: {
        ...themeConfig[mode],
        [key]: value,
      },
    });
  };

  const updateColorFromPicker = (
    mode: "light" | "dark",
    key: string,
    hexValue: string
  ) => {
    const oklchValue = hexToOklch(hexValue);
    updateColor(mode, key, oklchValue);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Theme Editor</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-colors hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-gray-500">Loading theme...</div>
            </div>
          ) : themeConfig ? (
            <div className="p-4 space-y-6">
              {/* Mode Tabs */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab("light")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "light"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Light Mode
                </button>
                <button
                  onClick={() => setActiveTab("dark")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "dark"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dark Mode
                </button>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Colors</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(themeConfig[activeTab]).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-1">
                        <label className="text-xs font-medium text-gray-600 capitalize">
                          {key.replace(/-/g, " ")}
                        </label>
                        <div className="flex gap-2">
                          {/* Color Picker */}
                          <input
                            type="color"
                            value={oklchToHex(value)}
                            onChange={(e) =>
                              updateColorFromPicker(
                                activeTab,
                                key,
                                e.target.value
                              )
                            }
                            className="w-12 h-10 rounded border cursor-pointer"
                          />
                          {/* Text Input for OKLCH */}
                          <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              updateColor(activeTab, key, e.target.value)
                            }
                            className="flex-1 px-3 py-2 font-mono text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="oklch(0.5 0.1 180)"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Fonts */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Fonts</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(themeConfig.fonts).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 capitalize">
                        {key.replace(/-/g, " ")}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setThemeConfig({
                            ...themeConfig,
                            fonts: {
                              ...themeConfig.fonts,
                              [key]: e.target.value,
                            },
                          })
                        }
                        className="px-3 py-2 w-full font-mono text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Border Radius
                </h3>
                <input
                  type="text"
                  value={themeConfig.radius}
                  onChange={(e) =>
                    setThemeConfig({
                      ...themeConfig,
                      radius: e.target.value,
                    })
                  }
                  className="px-3 py-2 w-full font-mono text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Spacing */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Spacing</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(themeConfig.spacing).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-medium text-gray-600">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setThemeConfig({
                            ...themeConfig,
                            spacing: {
                              ...themeConfig.spacing,
                              [key]: e.target.value,
                            },
                          })
                        }
                        className="px-3 py-2 w-full font-mono text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <Button onClick={saveTheme} disabled={saving} size="medium">
            {saving ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </div>
    </>
  );
}
