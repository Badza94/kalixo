import { CSSProperties } from "react";

/**
 * Puck's default select dropdown styling
 * Matches the appearance of Puck's built-in select elements
 */
export const puckSelectStyle: CSSProperties = {
  appearance: "none",
  background:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23c3c3c3'%3E%3Cpolygon points='0,0 100,0 50,50'/%3E%3C/svg%3E\") calc(100% - 12px) calc(50% + 3px) / 12px no-repeat",
  backgroundColor: "var(--puck-color-white, #ffffff)",
};

/**
 * Puck's select styling for smaller selects (e.g., in grid layouts)
 */
export const puckSelectStyleSmall: CSSProperties = {
  appearance: "none",
  background:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23c3c3c3'%3E%3Cpolygon points='0,0 100,0 50,50'/%3E%3C/svg%3E\") calc(100% - 8px) calc(50% + 2px) / 10px no-repeat",
  backgroundColor: "var(--puck-color-white, #ffffff)",
};

/**
 * Puck's input styling
 */
export const puckInputStyle: CSSProperties = {
  backgroundColor: "var(--puck-color-white, #ffffff)",
  border: "1px solid var(--puck-color-grey-03, #d9d9d9)",
  borderRadius: "4px",
};

/**
 * Puck's select className
 */
export const puckSelectClassName =
  "w-full px-3 py-2 border rounded-sm cursor-pointer focus:border-[var(--puck-color-gray-05)] focus:outline-2 focus:outline-[var(--puck-color-azure-05)]";

/**
 * Puck's select className for small selects
 */
export const puckSelectClassNameSmall =
  "w-full px-2 py-1 text-sm border rounded-sm cursor-pointer";

/**
 * Puck's input className
 */
export const puckInputClassName = "w-full px-3 py-2 border rounded-sm";
