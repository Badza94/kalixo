"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const usePuck = createUsePuck<typeof config>();

interface TabbedFieldsWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
}

type FieldWithKind = Field & {
  kind?: FieldCategory;
  label?: string;
};

type TabDefinition = {
  value: FieldCategory;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count: number;
  hasFields: boolean;
};

function normalizeLabelValue(value: string): string {
  return value.toLowerCase().trim();
}

function createLabelMappings(
  fields: Record<string, FieldWithKind>
): Map<string, string> {
  const map = new Map<string, string>();

  const addMappingKeys = (rawValue: string, fieldName: string) => {
    const normalized = normalizeLabelValue(rawValue);
    if (!normalized) return;
    map.set(normalized, fieldName);

    const withoutParens = normalized.replace(/\s*\([^)]*\)/g, "").trim();
    if (withoutParens && withoutParens !== normalized) {
      map.set(withoutParens, fieldName);
    }
  };

  Object.entries(fields).forEach(([fieldName, field]) => {
    map.set(fieldName.toLowerCase(), fieldName);

    const words = fieldName
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .trim();
    map.set(words, fieldName);

    const titleCase = words
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    map.set(titleCase.toLowerCase(), fieldName);

    const withPx = `${words} (px)`;
    map.set(withPx, fieldName);

    const withoutParens = words.split("(")[0].trim();
    if (withoutParens !== words) {
      map.set(withoutParens, fieldName);
    }

    if (field.label) {
      addMappingKeys(field.label, fieldName);
    }
  });

  return map;
}

const getTabStyles = () => `
  .fields-container[data-active-tab] [data-field-category] {
    display: none !important;
  }
  
  .fields-container[data-active-tab="content"] [data-field-category="content"],
  .fields-container[data-active-tab="layout"] [data-field-category="layout"],
  .fields-container[data-active-tab="style"] [data-field-category="style"],
  .fields-container[data-active-tab="advanced"] [data-field-category="advanced"] {
    display: block !important;
  }
`;

export function TabbedFieldsWrapper({
  children,
  isLoading,
}: TabbedFieldsWrapperProps) {
  const [activeTab, setActiveTab] = useState<FieldCategory>("content");
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const selectedItem = usePuck((state) => state.selectedItem);

  const componentConfig = useMemo(() => {
    if (!selectedItem?.type) return null;
    const components = config.components as Record<
      string,
      { fields?: Record<string, FieldWithKind> }
    >;
    return components[selectedItem.type];
  }, [selectedItem?.type]);

  const isLayout = useMemo(() => {
    return selectedItem?.type ? isLayoutComponent(selectedItem.type) : false;
  }, [selectedItem?.type]);

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

    Object.entries(componentConfig.fields).forEach(([name, field]) => {
      const fieldKind = field.kind;
      const category =
        fieldKind === "content" ||
        fieldKind === "layout" ||
        fieldKind === "style" ||
        fieldKind === "advanced"
          ? fieldKind
          : categorizeField(name, selectedItem?.type);

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
  }, [componentConfig?.fields, selectedItem?.type]);

  const fieldCategoryMap = useMemo(() => {
    const map = new Map<string, FieldCategory>();
    categorizedFieldNames.content.forEach((name) => map.set(name, "content"));
    categorizedFieldNames.layout.forEach((name) => map.set(name, "layout"));
    categorizedFieldNames.style.forEach((name) => map.set(name, "style"));
    categorizedFieldNames.advanced.forEach((name) => map.set(name, "advanced"));
    return map;
  }, [categorizedFieldNames]);

  const labelToFieldMap = useMemo(() => {
    return componentConfig?.fields
      ? createLabelMappings(componentConfig.fields)
      : new Map<string, string>();
  }, [componentConfig?.fields]);

  const contentCount = categorizedFieldNames.content.size;
  const layoutCount = categorizedFieldNames.layout.size;
  const styleCount = categorizedFieldNames.style.size;
  const advancedCount = categorizedFieldNames.advanced.size;

  const tabs = useMemo<TabDefinition[]>(() => {
    if (isLayout) {
      return [
        {
          value: "layout",
          label: "Layout",
          icon: LayoutGrid,
          count: layoutCount,
          hasFields: layoutCount > 0,
        },
        {
          value: "style",
          label: "Style",
          icon: Paintbrush,
          count: styleCount,
          hasFields: styleCount > 0,
        },
        {
          value: "advanced",
          label: "Advanced",
          icon: Settings2,
          count: advancedCount,
          hasFields: advancedCount > 0,
        },
      ];
    }

    const baseTabs: TabDefinition[] = [
      {
        value: "content",
        label: "Content",
        icon: Type,
        count: contentCount,
        hasFields: contentCount > 0,
      },
      {
        value: "style",
        label: "Style",
        icon: Paintbrush,
        count: styleCount,
        hasFields: styleCount > 0,
      },
      {
        value: "advanced",
        label: "Advanced",
        icon: Settings2,
        count: advancedCount,
        hasFields: advancedCount > 0,
      },
    ];

    if (layoutCount > 0) {
      baseTabs.splice(1, 0, {
        value: "layout",
        label: "Layout",
        icon: LayoutGrid,
        count: layoutCount,
        hasFields: true,
      });
    }

    return baseTabs;
  }, [isLayout, contentCount, layoutCount, styleCount, advancedCount]);

  const effectiveTab = useMemo(() => {
    const active = tabs.find((tab) => tab.value === activeTab && tab.hasFields);
    if (active) return activeTab;

    return tabs.find((tab) => tab.hasFields)?.value ?? tabs[0]?.value;
  }, [activeTab, tabs]);

  const tabGridClass = useMemo(() => {
    return isLayout || tabs.length === 4 ? "grid-cols-4" : "grid-cols-3";
  }, [isLayout, tabs.length]);

  const matchLabelToField = useCallback(
    (labelText: string): string | null => {
      const normalized = normalizeLabelValue(labelText);

      let fieldName = labelToFieldMap.get(normalized);
      if (fieldName) return fieldName;

      const withoutParens = normalized.replace(/\s*\([^)]*\)/g, "").trim();
      fieldName = labelToFieldMap.get(withoutParens);
      if (fieldName) return fieldName;

      for (const [pattern, name] of labelToFieldMap.entries()) {
        if (normalized.includes(pattern) || pattern.includes(normalized)) {
          return name;
        }
      }

      return null;
    },
    [labelToFieldMap]
  );

  const getFieldNameFromWrapper = useCallback((wrapper: HTMLElement) => {
    const namedControl = wrapper.querySelector<HTMLElement>("[name]");
    const nameAttr = namedControl?.getAttribute("name");
    if (nameAttr) {
      const normalized = nameAttr
        .split(".")
        .pop()
        ?.replace(/\[\d+\]/g, "")
        .trim();
      return normalized || null;
    }

    const idControl = wrapper.querySelector<HTMLElement>("[id]");
    const idAttr = idControl?.getAttribute("id");
    if (idAttr) {
      const match = idAttr.match(
        /_(?:select|textarea|radio|input|number|text|range|checkbox|color)_([a-zA-Z0-9]+)$/i
      );
      if (match?.[1]) return match[1];

      const fallback = idAttr.split("_").pop()?.trim();
      if (fallback) return fallback;
    }

    return null;
  }, []);

  const getLabelTextFromWrapper = useCallback((wrapper: HTMLElement) => {
    const label = wrapper.querySelector("label");
    const labelText = label?.textContent?.trim();
    if (labelText) return labelText;

    const control = wrapper.querySelector<HTMLElement>(
      "input, textarea, select, [role='radiogroup']"
    );
    return (
      control?.getAttribute("aria-label")?.trim() ||
      control?.getAttribute("title")?.trim() ||
      ""
    );
  }, []);

  const resolveCategoryForField = useCallback(
    (fieldName: string | null, labelText?: string) => {
      if (fieldName) {
        const foundCategory = fieldCategoryMap.get(fieldName);
        if (foundCategory) return foundCategory;
      }

      if (labelText) {
        const matchedName = matchLabelToField(labelText);
        if (matchedName) {
          const matchedCategory = fieldCategoryMap.get(matchedName);
          if (matchedCategory) return matchedCategory;
        }
      }

      return isLayout ? "layout" : "content";
    },
    [fieldCategoryMap, matchLabelToField, isLayout]
  );

  const tagFieldsWithCategories = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const fieldsContainer = container.querySelector(".fields-container");
    if (!fieldsContainer) return;

    const root = fieldsContainer.querySelector("form") ?? fieldsContainer;

    const labels = root.querySelectorAll("label");
    const processedElements = new Set<Element>();

    labels.forEach((label) => {
      const labelText = label.textContent?.trim() || "";
      if (!labelText) return;

      let wrapper = (label as HTMLElement).closest(
        '[class*="PuckFields-field"]'
      ) as HTMLElement | null;

      if (!wrapper) {
        wrapper = (label as HTMLElement).closest(
          '[class*="InputWrapper"]'
        ) as HTMLElement | null;
      }

      if (!wrapper) {
        let current: HTMLElement | null = label as HTMLElement;
        while (current && current.parentElement !== root) {
          current = current.parentElement;
        }
        wrapper = current;
      }

      if (!wrapper || processedElements.has(wrapper)) {
        return;
      }

      processedElements.add(wrapper);

      const fieldName = getFieldNameFromWrapper(wrapper);
      const category = resolveCategoryForField(fieldName, labelText);
      wrapper.setAttribute("data-field-category", category);
    });

    const allWrappers = root.querySelectorAll(
      '[class*="PuckFields-field"], [class*="InputWrapper"]'
    );
    allWrappers.forEach((wrapper) => {
      if (processedElements.has(wrapper)) return;
      const fieldName = getFieldNameFromWrapper(wrapper as HTMLElement);
      const labelText = getLabelTextFromWrapper(wrapper as HTMLElement);
      const category = resolveCategoryForField(fieldName, labelText);
      (wrapper as HTMLElement).setAttribute("data-field-category", category);
    });
  }, [
    getFieldNameFromWrapper,
    getLabelTextFromWrapper,
    resolveCategoryForField,
  ]);

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.setAttribute("data-tabbed-fields", "true");
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = getTabStyles();

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !componentConfig?.fields) return;

    const timeoutId = setTimeout(() => {
      tagFieldsWithCategories();
    }, 100);

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver(() => {
      setTimeout(tagFieldsWithCategories, 50);
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
  }, [componentConfig?.fields, tagFieldsWithCategories]);

  if (!selectedItem || !componentConfig?.fields || isLoading) {
    return <div className="puck-fields-wrapper">{children}</div>;
  }

  return (
    <div className="w-full tabbed-fields-wrapper" ref={containerRef}>
      <Tabs
        value={effectiveTab}
        onValueChange={(value) => setActiveTab(value as FieldCategory)}
        className="w-full"
      >
        <TabsList
          className={`grid sticky top-0 z-10 ${tabGridClass} mb-3 w-full border-b backdrop-blur-sm bg-background/95`}
        >
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

        <div className="fields-container" data-active-tab={effectiveTab}>
          {children}
        </div>
      </Tabs>
    </div>
  );
}
