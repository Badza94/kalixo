"use client";

import React, { useState } from "react";
import { puckSelectStyle, puckSelectClassName } from "../lib/puck-styles";

interface BorderRadiusFieldProps {
  value?: {
    size:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "none"
      | "full"
      | "custom";
    customValue?: string;
  };
  onChange: (value: {
    size:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "none"
      | "full"
      | "custom";
    customValue?: string;
  }) => void;
  label?: string;
}

export function BorderRadiusField({
  value = { size: "none" },
  onChange,
  label = "Border Radius",
}: BorderRadiusFieldProps) {
  const [showCustomInput, setShowCustomInput] = useState(
    value.size === "custom"
  );

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value as
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "none"
      | "full"
      | "custom";
    setShowCustomInput(newSize === "custom");
    onChange({
      size: newSize,
      customValue: value?.customValue,
    });
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      size: "custom",
      customValue: e.target.value,
    });
  };

  // Map sizes to actual values
  const borderRadiusMap = {
    none: "0",
    xs: "2px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "24px",
    "4xl": "32px",
    full: "9999px",
  };

  const resolvedValue =
    value.size === "custom" && value.customValue
      ? value.customValue
      : value.size !== "custom"
        ? borderRadiusMap[value.size]
        : "0";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Border radius preset selector */}
      <select
        value={value.size}
        onChange={handleSizeChange}
        className={puckSelectClassName}
        style={puckSelectStyle}
      >
        <option value="none">None</option>
        <option value="xs">XS (2px)</option>
        <option value="sm">SM (4px)</option>
        <option value="md">MD (6px)</option>
        <option value="lg">LG (8px)</option>
        <option value="xl">XL (12px)</option>
        <option value="2xl">2XL (16px)</option>
        <option value="3xl">3XL (24px)</option>
        <option value="4xl">4XL (32px)</option>
        <option value="full">Full (9999px)</option>
        <option value="custom">Custom</option>
      </select>

      {/* Custom value input */}
      {showCustomInput && (
        <input
          type="text"
          value={value.customValue || ""}
          onChange={handleCustomValueChange}
          placeholder="e.g., 10px, 1rem, 50%"
          className="px-3 py-2 w-full font-mono text-sm rounded-md border"
        />
      )}
    </div>
  );
}
