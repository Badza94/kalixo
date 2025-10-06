"use client";

import React, { useState } from "react";
import { getThemeColorOptions, resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import { puckSelectStyle, puckSelectClassName } from "../lib/puck-styles";
interface ColorPickerFieldProps {
  value?: {
    colorKey: string;
    customColor?: string;
  };
  onChange: (value: { colorKey: string; customColor?: string }) => void;
  label?: string;
}

export function ColorPickerField({
  value = { colorKey: "foreground" },
  onChange,
  label = "Color",
}: ColorPickerFieldProps) {
  const { themeConfig, loading } = useThemeConfig();
  const [showCustomPicker, setShowCustomPicker] = useState(
    value.colorKey === "custom"
  );

  const handleColorKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newColorKey = e.target.value;
    setShowCustomPicker(newColorKey === "custom");
    onChange({
      colorKey: newColorKey,
      customColor: value.customColor,
    });
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      colorKey: "custom",
      customColor: e.target.value,
    });
  };

  const resolvedColor = themeConfig
    ? resolveColor(value.colorKey, value.customColor, themeConfig, "light")
    : value.customColor || "#000000";

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <div className="px-3 py-2 w-full bg-gray-100 rounded-md border animate-pulse">
          Loading colors...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Color preset selector */}
      <select
        value={value.colorKey}
        onChange={handleColorKeyChange}
        className={puckSelectClassName}
        style={puckSelectStyle}
      >
        {getThemeColorOptions().map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom color picker */}
      {showCustomPicker && (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={value.customColor || "#000000"}
            onChange={handleCustomColorChange}
            className="w-12 h-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={value.customColor || "#000000"}
            onChange={handleCustomColorChange}
            placeholder="#000000"
            className="flex-1 px-3 py-2 font-mono text-sm rounded-md border"
          />
        </div>
      )}

      {/* Color preview */}
      <div className="flex gap-2 items-center p-2 bg-gray-50 rounded-md border">
        <div
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: resolvedColor }}
        />
        <span className="font-mono text-xs text-gray-600 break-all">
          {resolvedColor}
        </span>
      </div>
    </div>
  );
}
