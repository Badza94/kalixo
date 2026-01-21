"use client";

import React, { useState, useCallback } from "react";
import { Link2, Unlink } from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface ElementorSpacingFieldProps {
  value?: SpacingValue;
  onChange: (value: SpacingValue) => void;
  label?: string;
  unit?: string;
}

/**
 * Elementor-style spacing field with linked corners
 * Shows Top, Right, Bottom, Left inputs with a link button to sync all values
 */
export function ElementorSpacingField({
  value = {},
  onChange,
  label = "Margin",
  unit = "px",
}: ElementorSpacingFieldProps) {
  const [isLinked, setIsLinked] = useState(() => {
    // Check if all values are the same (or all undefined/empty)
    const top = value.top || "0";
    const right = value.right || "0";
    const bottom = value.bottom || "0";
    const left = value.left || "0";
    return top === right && right === bottom && bottom === left;
  });

  const handleValueChange = useCallback(
    (side: keyof SpacingValue, newValue: string) => {
      // Remove any non-numeric characters except decimal point and minus
      const numericValue = newValue.replace(/[^0-9.-]/g, "");

      if (isLinked) {
        // Update all sides to the same value
        onChange({
          top: numericValue,
          right: numericValue,
          bottom: numericValue,
          left: numericValue,
        });
      } else {
        // Update only the specific side
        onChange({
          ...value,
          [side]: numericValue,
        });
      }
    },
    [isLinked, onChange, value]
  );

  const toggleLinked = useCallback(() => {
    if (!isLinked) {
      // When linking, set all values to the top value
      const topValue = value.top || "0";
      onChange({
        top: topValue,
        right: topValue,
        bottom: topValue,
        left: topValue,
      });
    }
    setIsLinked(!isLinked);
  }, [isLinked, onChange, value]);

  const getDisplayValue = (val: string | undefined) => {
    return val || "0";
  };

  return (
    <div className="space-y-2">
      {/* Header with label and unit */}
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1">
          {/* Link/Unlink button */}
          <button
            type="button"
            onClick={toggleLinked}
            className={cn(
              "p-1 rounded hover:bg-muted transition-colors",
              isLinked ? "text-primary" : "text-muted-foreground"
            )}
            title={isLinked ? "Unlink values" : "Link values"}
          >
            {isLinked ? (
              <Link2 className="w-3.5 h-3.5" />
            ) : (
              <Unlink className="w-3.5 h-3.5" />
            )}
          </button>
          {/* Unit indicator */}
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
            {unit}
          </span>
        </div>
      </div>

      {/* Spacing inputs - Elementor style layout */}
      <div className="relative">
        {/* Visual box representation */}
        <div className="bg-muted/30 border border-border rounded-md p-3">
          {/* Top input */}
          <div className="flex justify-center mb-2">
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={getDisplayValue(value.top)}
                onChange={(e) => handleValueChange("top", e.target.value)}
                className="w-14 h-7 text-center text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Top</span>
            </div>
          </div>

          {/* Middle row: Left - Center Box - Right */}
          <div className="flex items-center justify-between gap-2">
            {/* Left input */}
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={getDisplayValue(value.left)}
                onChange={(e) => handleValueChange("left", e.target.value)}
                className="w-14 h-7 text-center text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Left</span>
            </div>

            {/* Center visual element */}
            <div className="flex-1 h-10 bg-muted/50 border border-dashed border-border rounded-sm mx-2" />

            {/* Right input */}
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={getDisplayValue(value.right)}
                onChange={(e) => handleValueChange("right", e.target.value)}
                className="w-14 h-7 text-center text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Right</span>
            </div>
          </div>

          {/* Bottom input */}
          <div className="flex justify-center mt-2">
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={getDisplayValue(value.bottom)}
                onChange={(e) => handleValueChange("bottom", e.target.value)}
                className="w-14 h-7 text-center text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5">Bottom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version - horizontal layout like Elementor's collapsed view
 */
export function ElementorSpacingFieldCompact({
  value = {},
  onChange,
  label = "Margin",
  unit = "px",
}: ElementorSpacingFieldProps) {
  const [isLinked, setIsLinked] = useState(() => {
    const top = value.top || "0";
    const right = value.right || "0";
    const bottom = value.bottom || "0";
    const left = value.left || "0";
    return top === right && right === bottom && bottom === left;
  });

  const handleValueChange = useCallback(
    (side: keyof SpacingValue, newValue: string) => {
      const numericValue = newValue.replace(/[^0-9.-]/g, "");

      if (isLinked) {
        onChange({
          top: numericValue,
          right: numericValue,
          bottom: numericValue,
          left: numericValue,
        });
      } else {
        onChange({
          ...value,
          [side]: numericValue,
        });
      }
    },
    [isLinked, onChange, value]
  );

  const toggleLinked = useCallback(() => {
    if (!isLinked) {
      const topValue = value.top || "0";
      onChange({
        top: topValue,
        right: topValue,
        bottom: topValue,
        left: topValue,
      });
    }
    setIsLinked(!isLinked);
  }, [isLinked, onChange, value]);

  const getDisplayValue = (val: string | undefined) => val || "0";

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLinked}
            className={cn(
              "p-1 rounded hover:bg-muted transition-colors",
              isLinked ? "text-primary" : "text-muted-foreground"
            )}
            title={isLinked ? "Unlink values" : "Link values"}
          >
            {isLinked ? (
              <Link2 className="w-3.5 h-3.5" />
            ) : (
              <Unlink className="w-3.5 h-3.5" />
            )}
          </button>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
            {unit}
          </span>
        </div>
      </div>

      {/* Compact horizontal inputs */}
      <div className="grid grid-cols-4 gap-1">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <div key={side} className="flex flex-col items-center">
            <input
              type="text"
              value={getDisplayValue(value[side])}
              onChange={(e) => handleValueChange(side, e.target.value)}
              className="w-full h-8 text-center text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="0"
            />
            <span className="text-[10px] text-muted-foreground mt-0.5 capitalize">
              {side}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
