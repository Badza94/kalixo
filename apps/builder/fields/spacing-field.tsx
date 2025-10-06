"use client";

import React, { useState } from "react";
import { getSpacingOptions } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";
import {
  puckSelectStyle,
  puckSelectStyleSmall,
  puckSelectClassName,
  puckSelectClassNameSmall,
  puckInputClassName,
} from "../lib/puck-styles";
import { Button } from "@measured/puck";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string; // For uniform spacing
}

interface SpacingFieldProps {
  value?: SpacingValue;
  onChange: (value: SpacingValue) => void;
  label?: string;
}

export function SpacingField({
  value = {},
  onChange,
  label = "Spacing",
}: SpacingFieldProps) {
  const { themeConfig, loading } = useThemeConfig();
  const [mode, setMode] = useState<"all" | "individual">(
    value.all ? "all" : "individual"
  );

  const spacingOptions = getSpacingOptions(themeConfig || undefined);

  const handleModeChange = (newMode: "all" | "individual") => {
    setMode(newMode);
    if (newMode === "all") {
      // Convert to uniform spacing
      onChange({ all: value.top || "0" });
    } else {
      // Convert to individual spacing
      const all = value.all || "0";
      onChange({
        top: all,
        right: all,
        bottom: all,
        left: all,
      });
    }
  };

  const [customAllValue, setCustomAllValue] = useState(value.all || "0");
  const [customValues, setCustomValues] = useState({
    top: value.top || "0",
    right: value.right || "0",
    bottom: value.bottom || "0",
    left: value.left || "0",
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showCustomInputs, setShowCustomInputs] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });

  const handleAllChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === "custom") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onChange({ all: newValue });
    }
  };

  const handleCustomAllInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomAllValue(newValue);
    onChange({ all: newValue });
  };

  const handleIndividualChange = (
    side: "top" | "right" | "bottom" | "left",
    newValue: string
  ) => {
    if (newValue === "custom") {
      setShowCustomInputs({ ...showCustomInputs, [side]: true });
    } else {
      setShowCustomInputs({ ...showCustomInputs, [side]: false });
      onChange({
        ...value,
        [side]: newValue,
      });
    }
  };

  const handleCustomIndividualInput = (
    side: "top" | "right" | "bottom" | "left",
    newValue: string
  ) => {
    setCustomValues({ ...customValues, [side]: newValue });
    onChange({
      ...value,
      [side]: newValue,
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium">{label}</label>
        <div className="px-3 py-2 w-full bg-gray-100 rounded-md border animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-1 text-xs">
          <Button
            onClick={() => handleModeChange("all")}
            variant={mode === "all" ? "primary" : "secondary"}
          >
            All
          </Button>
          <Button
            onClick={() => handleModeChange("individual")}
            variant={mode === "individual" ? "primary" : "secondary"}
          >
            Individual
          </Button>
        </div>
      </div>

      {mode === "all" ? (
        <>
          <select
            id={`${label}-all-select`}
            value={showCustomInput ? "custom" : value.all || "0"}
            onChange={handleAllChange}
            className={puckSelectClassName}
            style={puckSelectStyle}
          >
            {spacingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showCustomInput && (
            <input
              type="text"
              value={customAllValue}
              onChange={handleCustomAllInput}
              placeholder="e.g., 1rem, 16px, 2em"
              className={`font-mono text-sm ${puckInputClassName}`}
            />
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">Top</label>
            <select
              value={showCustomInputs.top ? "custom" : value.top || "0"}
              onChange={(e) => handleIndividualChange("top", e.target.value)}
              className={puckSelectClassNameSmall}
              style={puckSelectStyleSmall}
            >
              {spacingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showCustomInputs.top && (
              <input
                type="text"
                value={customValues.top}
                onChange={(e) =>
                  handleCustomIndividualInput("top", e.target.value)
                }
                placeholder="e.g., 1rem"
                className="px-2 py-1 mt-1 w-full font-mono text-xs rounded-sm border"
              />
            )}
          </div>
          <div>
            <label htmlFor="right" className="text-xs text-gray-600">
              Right
            </label>
            <select
              id="right"
              value={showCustomInputs.right ? "custom" : value.right || "0"}
              onChange={(e) => handleIndividualChange("right", e.target.value)}
              className={puckSelectClassNameSmall}
              style={puckSelectStyleSmall}
            >
              {spacingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showCustomInputs.right && (
              <input
                id="right input"
                type="text"
                value={customValues.right}
                onChange={(e) =>
                  handleCustomIndividualInput("right", e.target.value)
                }
                placeholder="e.g., 1rem"
                className="px-2 py-1 mt-1 w-full font-mono text-xs rounded"
              />
            )}
          </div>
          <div>
            <label htmlFor="bottom" className="text-xs text-gray-600">
              Bottom
            </label>
            <select
              id="bottom"
              value={showCustomInputs.bottom ? "custom" : value.bottom || "0"}
              onChange={(e) => handleIndividualChange("bottom", e.target.value)}
              className={puckSelectClassNameSmall}
              style={puckSelectStyleSmall}
            >
              {spacingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showCustomInputs.bottom && (
              <input
                id="bottom input"
                type="text"
                value={customValues.bottom}
                onChange={(e) =>
                  handleCustomIndividualInput("bottom", e.target.value)
                }
                placeholder="e.g., 1rem"
                className="px-2 py-1 mt-1 w-full font-mono text-xs rounded border"
              />
            )}
          </div>
          <div>
            <label htmlFor="left" className="text-xs text-gray-600">
              Left
            </label>
            <select
              id="left"
              value={showCustomInputs.left ? "custom" : value.left || "0"}
              onChange={(e) => handleIndividualChange("left", e.target.value)}
              className={puckSelectClassNameSmall}
              style={puckSelectStyleSmall}
            >
              {spacingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {showCustomInputs.left && (
              <input
                id="left input"
                type="text"
                value={customValues.left}
                onChange={(e) =>
                  handleCustomIndividualInput("left", e.target.value)
                }
                placeholder="e.g., 1rem"
                className="px-2 py-1 mt-1 w-full font-mono text-xs rounded border"
              />
            )}
          </div>
        </div>
      )}

      {/* Visual preview */}
      <div className="p-2 font-mono text-xs text-gray-600 bg-gray-50 rounded-md border">
        {mode === "all"
          ? `${label}: ${value.all || "0"}`
          : `T:${value.top || "0"} R:${value.right || "0"} B:${value.bottom || "0"} L:${value.left || "0"}`}
      </div>
    </div>
  );
}
