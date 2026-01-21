import type { Field } from "@puckeditor/core";
import { organizeFieldsIntoGroups } from "./field-categorizer";

/**
 * Creates a resolveFields function that organizes fields into Content, Style, and Advanced tabs
 * Returns fields wrapped in object groups that will be rendered as tabs
 */
export function createTabbedFields<T extends Record<string, Field>>(
  originalFields: T
) {
  return (data: any, params: any) => {
    // Use lastFields if nothing changed to avoid unnecessary recalculation
    if (params.lastFields && !params.changed) {
      return params.lastFields;
    }
    const { content, style, advanced } =
      organizeFieldsIntoGroups(originalFields);

    // Create object fields for each tab
    const tabbedFields: Record<string, Field> = {};

    // Content tab
    if (Object.keys(content).length > 0) {
      tabbedFields._content = {
        type: "object",
        label: "Content",
        objectFields: content as Record<string, Field>,
      } as Field;
    }

    // Style tab
    if (Object.keys(style).length > 0) {
      tabbedFields._style = {
        type: "object",
        label: "Style",
        objectFields: style as Record<string, Field>,
      } as Field;
    }

    // Advanced tab
    if (Object.keys(advanced).length > 0) {
      tabbedFields._advanced = {
        type: "object",
        label: "Advanced",
        objectFields: advanced as Record<string, Field>,
      } as Field;
    }

    // If we have tabs, return tabbed structure, otherwise return original
    if (
      Object.keys(tabbedFields).length > 0 &&
      (Object.keys(content).length > 0 ||
        Object.keys(style).length > 0 ||
        Object.keys(advanced).length > 0)
    ) {
      return tabbedFields as T;
    }

    // Fallback to original fields if categorization didn't work
    return originalFields;
  };
}
