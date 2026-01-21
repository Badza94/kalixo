"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createUsePuck } from "@puckeditor/core";
import type { Field } from "@puckeditor/core";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  Type,
  Paintbrush,
  Settings2,
  LayoutGrid,
} from "@workspace/ui/lucide-react";
import {
  categorizeField,
  isLayoutComponent,
  type FieldCategory,
} from "../lib/field-categorizer";
import config from "../puck.config";

// Create typed usePuck hook
const usePuck = createUsePuck<typeof config>();

interface TabbedFieldsWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
}

// Create mappings from label variations to field names
function createLabelMappings(fieldNames: string[]): Map<string, string> {
  const map = new Map<string, string>();

  fieldNames.forEach((fieldName) => {
    // Exact match (lowercase)
    map.set(fieldName.toLowerCase(), fieldName);

    // camelCase to spaced lowercase - e.g., "backgroundColor" -> "background color"
    const words = fieldName
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .trim();
    map.set(words, fieldName);

    // Also map with first letter caps - e.g., "Background Color"
    const titleCase = words
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    map.set(titleCase.toLowerCase(), fieldName);

    // Handle edge cases like "maxWidth" -> "max width (px)"
    const withPx = `${words} (px)`;
    map.set(withPx, fieldName);

    // Handle "(e.g.," variations
    const withEg = words.split("(")[0].trim();
    if (withEg !== words) {
      map.set(withEg, fieldName);
    }
  });

  return map;
}

/**
 * TabbedFieldsWrapper - Organizes Puck fields into tabs like Elementor
 */
export function TabbedFieldsWrapper({
  children,
  isLoading,
}: TabbedFieldsWrapperProps) {
  const [activeTab, setActiveTab] = useState<FieldCategory>("content");
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Get current selection from Puck
  const selectedItem = usePuck((state) => state.selectedItem);

  // Get the component config for the selected item
  const componentConfig = useMemo(() => {
    if (!selectedItem?.type) return null;
    const components = config.components as Record<
      string,
      { fields?: Record<string, Field> }
    >;
    return components[selectedItem.type];
  }, [selectedItem?.type]);

  // Check if this is a layout component
  const isLayout = useMemo(() => {
    return selectedItem?.type ? isLayoutComponent(selectedItem.type) : false;
  }, [selectedItem?.type]);

  // Get field names and categorize them
  const categorizedFieldNames = useMemo(() => {
    if (!componentConfig?.fields) {
      return {
        content: new Set<string>(),
        layout: new Set<string>(),
        style: new Set<string>(),
        advanced: new Set<string>(),
      };
    }

    const content = new Set<string>();
    const layout = new Set<string>();
    const style = new Set<string>();
    const advanced = new Set<string>();

    Object.keys(componentConfig.fields).forEach((name) => {
      const category = categorizeField(name, selectedItem?.type);
      switch (category) {
        case "layout":
          layout.add(name);
          break;
        case "style":
          style.add(name);
          break;
        case "advanced":
          advanced.add(name);
          break;
        default:
          content.add(name);
      }
    });

    return { content, layout, style, advanced };
  }, [componentConfig, selectedItem?.type]);

  // Create field name to category map
  const fieldCategoryMap = useMemo(() => {
    const map = new Map<string, FieldCategory>();
    categorizedFieldNames.content.forEach((name) => map.set(name, "content"));
    categorizedFieldNames.layout.forEach((name) => map.set(name, "layout"));
    categorizedFieldNames.style.forEach((name) => map.set(name, "style"));
    categorizedFieldNames.advanced.forEach((name) => map.set(name, "advanced"));
    return map;
  }, [categorizedFieldNames]);

  // Create label to field name lookup
  const labelToFieldMap = useMemo(() => {
    return createLabelMappings(Array.from(fieldCategoryMap.keys()));
  }, [fieldCategoryMap]);

  // Count fields per category
  const contentCount = categorizedFieldNames.content.size;
  const layoutCount = categorizedFieldNames.layout.size;
  const styleCount = categorizedFieldNames.style.size;
  const advancedCount = categorizedFieldNames.advanced.size;

  // Check if we have fields in each category
  const hasContentFields = contentCount > 0;
  const hasLayoutFields = layoutCount > 0;
  const hasStyleFields = styleCount > 0;
  const hasAdvancedFields = advancedCount > 0;

  // Find field wrapper for a label element by traversing up to find a reasonable container
  const findFieldWrapper = useCallback(
    (label: HTMLElement, form: HTMLElement): HTMLElement | null => {
      let current: HTMLElement | null = label;

      // Traverse up until we find a direct child of form or hit the form itself
      while (current && current !== form) {
        if (current.parentElement === form) {
          return current;
        }
        current = current.parentElement as HTMLElement | null;
      }

      return null;
    },
    []
  );

  // Try to match a label text to a field name
  const matchLabelToField = useCallback(
    (labelText: string): string | null => {
      const normalized = labelText.toLowerCase().trim();

      // Direct match
      let fieldName = labelToFieldMap.get(normalized);
      if (fieldName) return fieldName;

      // Try without parentheses content
      const withoutParens = normalized.replace(/\s*\([^)]*\)/g, "").trim();
      fieldName = labelToFieldMap.get(withoutParens);
      if (fieldName) return fieldName;

      // Try partial matching
      for (const [pattern, name] of labelToFieldMap.entries()) {
        if (normalized.includes(pattern) || pattern.includes(normalized)) {
          return name;
        }
      }

      return null;
    },
    [labelToFieldMap]
  );

  // Apply field visibility based on active tab
  const applyVisibility = useCallback(
    (tab: FieldCategory) => {
      const container = containerRef.current;
      if (!container) return;

      const fieldsContainer = container.querySelector(".fields-container");
      if (!fieldsContainer) return;

      const form = fieldsContainer.querySelector("form");
      if (!form) return;

      // Track which wrappers we've processed to avoid duplicates
      const processedWrappers = new Set<HTMLElement>();

      // Find all labels in the form
      const labels = form.querySelectorAll("label");

      labels.forEach((label) => {
        const labelText = label.textContent?.trim() || "";
        if (!labelText) return;

        // Find the wrapper for this label
        const wrapper = findFieldWrapper(
          label as HTMLElement,
          form as HTMLElement
        );
        if (!wrapper || processedWrappers.has(wrapper)) return;

        processedWrappers.add(wrapper);

        // Match label to field name
        const fieldName = matchLabelToField(labelText);

        // Get category
        let category: FieldCategory = isLayout ? "layout" : "content";
        if (fieldName) {
          const foundCategory = fieldCategoryMap.get(fieldName);
          if (foundCategory) {
            category = foundCategory;
          }
        }

        // Apply visibility
        const shouldShow = category === tab;
        wrapper.style.display = shouldShow ? "" : "none";
      });
    },
    [fieldCategoryMap, findFieldWrapper, matchLabelToField, isLayout]
  );

  // Apply visibility when tab changes or component changes
  useEffect(() => {
    if (!containerRef.current || !componentConfig?.fields) return;

    // Initial application with delay
    const timeoutId = setTimeout(() => {
      applyVisibility(activeTab);
    }, 200);

    // Observer for DOM changes
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver(() => {
      setTimeout(() => applyVisibility(activeTab), 100);
    });

    const fieldsContainer =
      containerRef.current.querySelector(".fields-container");
    if (fieldsContainer) {
      observerRef.current.observe(fieldsContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [componentConfig, activeTab, applyVisibility]);

  // Determine effective tab
  const effectiveTab = useMemo(() => {
    if (isLayout) {
      if (activeTab === "layout" && hasLayoutFields) return "layout";
      if (activeTab === "style" && hasStyleFields) return "style";
      if (activeTab === "advanced" && hasAdvancedFields) return "advanced";
      if (hasLayoutFields) return "layout";
      if (hasStyleFields) return "style";
      if (hasAdvancedFields) return "advanced";
      return "layout";
    }

    if (activeTab === "content" && hasContentFields) return "content";
    if (activeTab === "style" && hasStyleFields) return "style";
    if (activeTab === "advanced" && hasAdvancedFields) return "advanced";
    if (hasContentFields) return "content";
    if (hasStyleFields) return "style";
    if (hasAdvancedFields) return "advanced";
    return "content";
  }, [
    activeTab,
    isLayout,
    hasContentFields,
    hasLayoutFields,
    hasStyleFields,
    hasAdvancedFields,
  ]);

  // Handle tab change
  const handleTabChange = useCallback(
    (tab: string) => {
      const category = tab as FieldCategory;
      setActiveTab(category);
      // Apply visibility with a short delay
      setTimeout(() => applyVisibility(category), 50);
    },
    [applyVisibility]
  );

  // If no component is selected or loading, render children as-is
  if (!selectedItem || !componentConfig?.fields || isLoading) {
    return <div className="puck-fields-wrapper">{children}</div>;
  }

  // Determine available tabs
  const tabs = isLayout
    ? [
        {
          value: "layout" as const,
          label: "Layout",
          icon: LayoutGrid,
          count: layoutCount,
          hasFields: hasLayoutFields,
        },
        {
          value: "style" as const,
          label: "Style",
          icon: Paintbrush,
          count: styleCount,
          hasFields: hasStyleFields,
        },
        {
          value: "advanced" as const,
          label: "Advanced",
          icon: Settings2,
          count: advancedCount,
          hasFields: hasAdvancedFields,
        },
      ]
    : [
        {
          value: "content" as const,
          label: "Content",
          icon: Type,
          count: contentCount,
          hasFields: hasContentFields,
        },
        {
          value: "style" as const,
          label: "Style",
          icon: Paintbrush,
          count: styleCount,
          hasFields: hasStyleFields,
        },
        {
          value: "advanced" as const,
          label: "Advanced",
          icon: Settings2,
          count: advancedCount,
          hasFields: hasAdvancedFields,
        },
      ];

  return (
    <div className="w-full tabbed-fields-wrapper" ref={containerRef}>
      <Tabs
        value={effectiveTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid sticky top-0 z-10 grid-cols-3 mb-3 w-full border-b backdrop-blur-sm bg-background/95">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1 text-xs px-2 py-1.5"
              disabled={!tab.hasFields}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-[10px] text-muted-foreground ml-0.5 bg-muted px-1 rounded">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Fields container */}
        <div className="fields-container">{children}</div>

        {/* Empty state */}
        {effectiveTab === "advanced" && !hasAdvancedFields && (
          <p className="p-4 text-sm text-center text-muted-foreground">
            No advanced options available for this component.
          </p>
        )}
        {effectiveTab === "layout" && !hasLayoutFields && (
          <p className="p-4 text-sm text-center text-muted-foreground">
            No layout options available for this component.
          </p>
        )}
      </Tabs>
    </div>
  );
}
