import type { Field } from "@puckeditor/core";

/**
 * Categorizes fields into Content, Style, and Advanced groups
 * Similar to Elementor's tab organization
 */

// Content fields: text, images, links, data, arrays, objects with content
const CONTENT_FIELD_NAMES = [
  "text",
  "content",
  "heading",
  "subheading",
  "description",
  "badge",
  "title",
  "alt",
  "src",
  "href",
  "url",
  "image",
  "image2",
  "logo",
  "logoSrc",
  "items",
  "footerItems",
  "buttons",
  "productId",
  "productSelection",
  "relatedProducts",
  "template",
  "customFields",
  "html",
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
  "filterButtonText",
  "buttonLayout",
  "itemsPerSlide",
  "itemsPerPage",
  "syncWithFilters",
  "showPagination",
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
  "columns",
  "columnsSm",
  "columnsMd",
  "columnsLg",
  "columnsXl",
  "columns2xl",
  "direction",
  "wrap",
  "justify",
  "align",
  "width",
  "maxWidth",
  "height",
  "minHeight",
  "defaultSection",
];

// Style fields: colors, spacing, typography, borders, shadows, backgrounds
const STYLE_FIELD_NAMES = [
  "color",
  "textColor",
  "backgroundColor",
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "borderColor",
  "border",
  "borderRadius",
  "shadow",
  "margin",
  "padding",
  "gap",
  "itemGap",
  "itemPadding",
  "itemMinHeight",
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
  "opacity",
  "grayscale",
  "quality",
  "aspectRatio",
  "customAspectRatio",
  "objectFit",
  "objectPosition",
  "thickness",
  "variant",
  "disabled",
  "styling",
  "spacing",
  "position",
];

// Advanced fields: CSS classes, custom attributes, etc.
const ADVANCED_FIELD_NAMES = [
  "className",
  "id",
  "customAttributes",
  "css",
  "customCss",
];

export type FieldCategory = "content" | "style" | "advanced";

export function categorizeField(fieldName: string): FieldCategory {
  const lowerName = fieldName.toLowerCase();

  if (STYLE_FIELD_NAMES.some((name) => lowerName.includes(name.toLowerCase()))) {
    return "style";
  }

  if (ADVANCED_FIELD_NAMES.some((name) => lowerName.includes(name.toLowerCase()))) {
    return "advanced";
  }

  // Default to content
  return "content";
}

export function organizeFieldsIntoGroups<T extends Record<string, Field>>(
  fields: T
): {
  content: Partial<T>;
  style: Partial<T>;
  advanced: Partial<T>;
} {
  const content: Partial<T> = {};
  const style: Partial<T> = {};
  const advanced: Partial<T> = {};

  for (const [fieldName, field] of Object.entries(fields)) {
    const category = categorizeField(fieldName);

    if (category === "style") {
      style[fieldName as keyof T] = field as T[keyof T];
    } else if (category === "advanced") {
      advanced[fieldName as keyof T] = field as T[keyof T];
    } else {
      content[fieldName as keyof T] = field as T[keyof T];
    }
  }

  return { content, style, advanced };
}
