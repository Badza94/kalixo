import type { Field } from "@puckeditor/core";

/**
 * Categorizes fields into Content, Style, and Advanced groups
 * Following Elementor's tab organization:
 * - Content: Actual content (text, images, links, data, toggles)
 * - Style: Visual styling (colors, typography, backgrounds, borders)
 * - Advanced: Layout & positioning (margin, padding, width, position, CSS)
 */

// Layout components that should have Layout tab instead of Content
export const LAYOUT_COMPONENTS = ["GridBlock", "FlexBlock", "ContainerBlock"];

// Content fields: actual content, data, visibility toggles, text settings
export const CONTENT_FIELD_NAMES = [
  // Text content
  "text",
  "content",
  "heading",
  "subheading",
  "description",
  "badge",
  "title",
  "alt",
  "label",
  // Links & URLs
  "href",
  "url",
  "src",
  // Images & Media
  "image",
  "image2",
  "logo",
  "logoSrc",
  "icon",
  "iconPosition",
  // Data & Arrays
  "items",
  "footerItems",
  "buttons",
  "productId",
  "productSelection",
  "relatedProducts",
  "template",
  "customFields",
  "html",
  // Visibility toggles
  "showHeader",
  "showFooter",
  "showCategory",
  "showPrice",
  "showButtons",
  "showNavigation",
  "showDots",
  "showCounter",
  "showSearch",
  "showCart",
  "showWishlist",
  "showAccount",
  "showSocialLogin",
  "showRememberMe",
  "showForgotPassword",
  "showFilterButton",
  "showSortSelect",
  "showBrand",
  "showShortDescription",
  "showLongDescription",
  "showTermsAndConditions",
  "showRedemptionInstructions",
  "showRelatedProducts",
  "showPagination",
  // Settings
  "filterButtonText",
  "buttonLayout",
  "itemsPerSlide",
  "itemsPerPage",
  "syncWithFilters",
  "type",
  "level",
  "as",
  "listStyle",
  "orientation",
  "loop",
  "controls",
  "autoplay",
  "muted",
  "fill",
  "priority",
  "defaultSection",
  // Text alignment (for text components, not flex alignment)
  "align",
];

// Style fields: visual appearance (colors, typography, backgrounds, borders, shadows)
export const STYLE_FIELD_NAMES = [
  // Colors
  "color",
  "textColor",
  "backgroundColor",
  "borderColor",
  // Background
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  // Border
  "border",
  "borderRadius",
  // Shadow & Effects
  "shadow",
  "opacity",
  "grayscale",
  // Typography
  "size",
  "weight",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "leading",
  "letterSpacing",
  "textTransform",
  "textDecoration",
  // Image styling
  "quality",
  "aspectRatio",
  "customAspectRatio",
  "objectFit",
  "objectPosition",
  // Component variants
  "variant",
  "thickness",
  "disabled",
  "styling",
];

// Advanced fields: Layout, positioning, spacing, and custom code
export const ADVANCED_FIELD_NAMES = [
  // Spacing (Elementor puts these in Advanced)
  "margin",
  "padding",
  "gap",
  "itemGap",
  "itemPadding",
  "itemMinHeight",
  "spacing",
  // Sizing
  "width",
  "maxWidth",
  "height",
  "minHeight",
  // Layout positioning (not text alignment)
  "position",
  // Custom code & attributes
  "className",
  "id",
  "customAttributes",
  "css",
  "customCss",
];

// Layout-specific fields (for Layout tab in Grid/Flex/Container)
// These override the content/advanced categorization for layout components
// NOTE: padding, margin, gap stay in Advanced even for layout components (Elementor style)
const LAYOUT_FIELD_NAMES = [
  "columns",
  "columnsSm",
  "columnsMd",
  "columnsLg",
  "columnsXl",
  "columns2xl",
  "direction",
  "wrap",
  "justify",
  "align", // Flex alignment
  "items", // For slots/children
  "width", // Container width
  "maxWidth",
];

export type FieldCategory = "content" | "layout" | "style" | "advanced";

/**
 * Determines if a component is a layout component (Grid, Flex, Container)
 */
export function isLayoutComponent(componentType: string): boolean {
  return LAYOUT_COMPONENTS.includes(componentType);
}

/**
 * Categorize a field based on its name and optionally the component type
 */
export function categorizeField(
  fieldName: string,
  componentType?: string
): FieldCategory {
  const lowerName = fieldName.toLowerCase();

  // FIRST: Check if it's explicitly an Advanced field (always takes priority)
  // This ensures margin, padding, gap etc. stay in Advanced even for layout components
  if (ADVANCED_FIELD_NAMES.some((name) => lowerName === name.toLowerCase())) {
    return "advanced";
  }

  // For layout components, check if this is a layout field
  if (componentType && isLayoutComponent(componentType)) {
    if (LAYOUT_FIELD_NAMES.some((name) => lowerName === name.toLowerCase())) {
      return "layout";
    }
  }

  // Check Style fields (can use includes for compound names like backgroundColor)
  if (
    STYLE_FIELD_NAMES.some((name) => lowerName.includes(name.toLowerCase()))
  ) {
    return "style";
  }

  // Check Content fields (exact match)
  if (CONTENT_FIELD_NAMES.some((name) => lowerName === name.toLowerCase())) {
    return "content";
  }

  // Handle compound names that might be advanced (e.g., gridColumns)
  const advancedKeywords = [
    "margin",
    "padding",
    "width",
    "height",
    "gap",
    "position",
  ];
  if (advancedKeywords.some((kw) => lowerName.includes(kw))) {
    return "advanced";
  }

  // Default to content for regular components, layout for layout components
  return componentType && isLayoutComponent(componentType)
    ? "layout"
    : "content";
}

/**
 * Get field groups for accordions (Elementor-style grouping)
 */
export type FieldGroup = {
  key: string;
  label: string;
  icon?: string;
  fields: string[];
};

export const STYLE_FIELD_GROUPS: FieldGroup[] = [
  {
    key: "typography",
    label: "Typography",
    fields: [
      "size",
      "weight",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "lineHeight",
      "leading",
      "letterSpacing",
      "textTransform",
      "textDecoration",
    ],
  },
  {
    key: "colors",
    label: "Colors",
    fields: ["color", "textColor", "backgroundColor", "borderColor"],
  },
  {
    key: "background",
    label: "Background",
    fields: ["backgroundImage", "backgroundSize", "backgroundPosition"],
  },
  {
    key: "border",
    label: "Border",
    fields: ["border", "borderRadius"],
  },
  {
    key: "effects",
    label: "Effects",
    fields: ["shadow", "opacity", "grayscale"],
  },
];

export const ADVANCED_FIELD_GROUPS: FieldGroup[] = [
  {
    key: "spacing",
    label: "Spacing",
    fields: [
      "margin",
      "padding",
      "gap",
      "itemGap",
      "itemPadding",
      "itemMinHeight",
      "spacing",
    ],
  },
  {
    key: "sizing",
    label: "Sizing",
    fields: ["width", "maxWidth", "height", "minHeight"],
  },
  {
    key: "positioning",
    label: "Positioning",
    fields: ["position"],
  },
  {
    key: "custom",
    label: "Custom CSS",
    fields: ["className", "id", "customAttributes", "css", "customCss"],
  },
];

export const LAYOUT_FIELD_GROUPS: FieldGroup[] = [
  {
    key: "structure",
    label: "Structure",
    fields: [
      "columns",
      "columnsSm",
      "columnsMd",
      "columnsLg",
      "columnsXl",
      "columns2xl",
      "items",
    ],
  },
  {
    key: "alignment",
    label: "Alignment",
    fields: ["direction", "wrap", "justify", "align"],
  },
  {
    key: "sizing",
    label: "Sizing",
    fields: ["width", "maxWidth"],
  },
  {
    key: "spacing",
    label: "Spacing",
    fields: ["gap"],
  },
];

export function organizeFieldsIntoGroups<T extends Record<string, Field>>(
  fields: T,
  componentType?: string
): {
  content: Partial<T>;
  layout: Partial<T>;
  style: Partial<T>;
  advanced: Partial<T>;
} {
  const content: Partial<T> = {};
  const layout: Partial<T> = {};
  const style: Partial<T> = {};
  const advanced: Partial<T> = {};

  for (const [fieldName, field] of Object.entries(fields)) {
    const category = categorizeField(fieldName, componentType);

    switch (category) {
      case "layout":
        layout[fieldName as keyof T] = field as T[keyof T];
        break;
      case "style":
        style[fieldName as keyof T] = field as T[keyof T];
        break;
      case "advanced":
        advanced[fieldName as keyof T] = field as T[keyof T];
        break;
      default:
        content[fieldName as keyof T] = field as T[keyof T];
    }
  }

  return { content, layout, style, advanced };
}
