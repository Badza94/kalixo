import type { Config } from "@measured/puck";
import { NavigationBlock } from "./blocks/navigation-block";
import { HeroBlock } from "./blocks/hero-block";
import { HeadingBlock } from "./blocks/heading-block";
import { TextBlock } from "./blocks/text-block";
import { RichTextBlock, RichTextEditor } from "./blocks/rich-text-block";
import { GridBlock } from "./blocks/grid-block";
import { ContainerBlock } from "./blocks/container-block";
import { FlexBlock } from "./blocks/flex-block";
import { ColorPickerField } from "./fields/color-picker-field";
import { SpacingField } from "./fields/spacing-field";
import { BorderRadiusField } from "./fields/border-radius-field";
import { SharedAssets } from "@workspace/ui/assets";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

type Props = {
  HeadingBlock: {
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    text: string;
    className?: string;
    align?: "left" | "center" | "right";
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
    weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
    color?: {
      colorKey: string;
      customColor?: string;
    };
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    margin?: SpacingValue;
    padding?: SpacingValue;
    fontFamily?: string;
    customFontFamily?: string;
    lineHeight?: string;
    customLineHeight?: string;
    letterSpacing?: string;
    customLetterSpacing?: string;
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    textDecoration?: "none" | "underline" | "line-through" | "overline";
    opacity?: string;
    customOpacity?: string;
  };
  TextBlock: {
    text: string;
    className?: string;
    align?: "left" | "center" | "right";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    weight?: "light" | "normal" | "medium" | "semibold" | "bold";
    color?:
      | "default"
      | "muted"
      | "primary"
      | "secondary"
      | "accent"
      | "destructive";
    leading?: "tight" | "snug" | "normal" | "relaxed" | "loose";
    as?: "p" | "span" | "div";
    listStyle?:
      | "none"
      | "disc"
      | "decimal"
      | "lower-alpha"
      | "upper-alpha"
      | "lower-roman"
      | "upper-roman";
    textDecoration?: "none" | "underline" | "overline" | "line-through";
    fontStyle?: "normal" | "italic";
  };
  RichTextBlock: {
    content?: string;
    className?: string;
  };
  NavigationBlock: {
    type: "header" | "sidebar" | "mega-menu" | "search-first" | "mobile";
    logo: string;
    items: Array<{
      id: string;
      label: string;
      href: string;
      children?: Array<{
        id: string;
        label: string;
        href: string;
        children?: Array<{
          id: string;
          label: string;
          href: string;
        }>;
      }>;
    }>;
    showSearch: boolean;
    showCart: boolean;
    showWishlist: boolean;
    showAccount: boolean;
    cartCount: number;
  };
  HeroBlock: {
    type: "hero1" | "hero2";
    badge?: string;
    heading: string;
    subheading?: string;
    description: string;
    buttons?: {
      primary?: {
        text: string;
        url: string;
      };
      secondary?: {
        text: string;
        url: string;
      };
    };
    image: {
      src: string;
      alt: string;
    };
    image2: {
      src: string;
      alt: string;
    };
  };
  GridBlock: {
    columns: number;
    gap: "none" | "sm" | "md" | "lg" | "xl";
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    borderRadius?: {
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
    className?: string;
    items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  };
  ContainerBlock: {
    width?: "full" | "container" | "narrow" | "wide";
    maxWidth?: string;
    padding?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    backgroundImage?: string;
    backgroundSize?: "cover" | "contain" | "auto";
    backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
    borderRadius?: {
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
    border?: {
      width?: string;
      style?: "solid" | "dashed" | "dotted";
      color?: string;
    };
    shadow?: "none" | "sm" | "md" | "lg" | "xl";
    className?: string;
    items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  };
  FlexBlock: {
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    wrap?: "nowrap" | "wrap" | "wrap-reverse";
    justify?:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
    align?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    gap?: string;
    width?: string;
    height?: string;
    minHeight?: string;
    padding?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    backgroundColor?: {
      colorKey: string;
      customColor?: string;
    };
    borderRadius?: {
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
    className?: string;
    items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      label: "Heading",
      fields: {
        level: {
          label: "Level",
          type: "select",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        text: {
          type: "textarea",
          contentEditable: true,
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "XL", value: "xl" },
            { label: "2XL", value: "2xl" },
            { label: "3XL", value: "3xl" },
            { label: "4XL", value: "4xl" },
            { label: "5XL", value: "5xl" },
            { label: "6XL", value: "6xl" },
          ],
        },
        weight: {
          type: "select",
          options: [
            { label: "Light", value: "light" },
            { label: "Normal", value: "normal" },
            { label: "Medium", value: "medium" },
            { label: "Semibold", value: "semibold" },
            { label: "Bold", value: "bold" },
            { label: "Extra Bold", value: "extrabold" },
          ],
        },
        color: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "foreground" }}
              onChange={onChange}
              label="Text Color"
            />
          ),
        },
        margin: {
          type: "custom",
          render: ({ onChange, value }) => (
            <SpacingField
              value={value || {}}
              onChange={onChange}
              label="Margin"
            />
          ),
        },
        padding: {
          type: "custom",
          render: ({ onChange, value }) => (
            <SpacingField
              value={value || {}}
              onChange={onChange}
              label="Padding"
            />
          ),
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "background" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        fontFamily: {
          type: "select",
          options: [
            { label: "Sans Serif", value: "font-sans" },
            { label: "Serif", value: "font-serif" },
            { label: "Monospace", value: "font-mono" },
          ],
        },
        lineHeight: {
          type: "select",
          options: [
            { label: "Tight (1.25)", value: "1.25" },
            { label: "Snug (1.375)", value: "1.375" },
            { label: "Normal (1.5)", value: "1.5" },
            { label: "Relaxed (1.625)", value: "1.625" },
            { label: "Loose (2)", value: "2" },
          ],
        },
        letterSpacing: {
          type: "select",
          options: [
            { label: "Tighter (-0.05em)", value: "-0.05em" },
            { label: "Tight (-0.025em)", value: "-0.025em" },
            { label: "Normal (0)", value: "0" },
            { label: "Wide (0.025em)", value: "0.025em" },
            { label: "Wider (0.05em)", value: "0.05em" },
            { label: "Widest (0.1em)", value: "0.1em" },
          ],
        },
        textTransform: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Uppercase", value: "uppercase" },
            { label: "Lowercase", value: "lowercase" },
            { label: "Capitalize", value: "capitalize" },
          ],
        },
        textDecoration: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Underline", value: "underline" },
            { label: "Line Through", value: "line-through" },
            { label: "Overline", value: "overline" },
          ],
        },
        opacity: {
          type: "select",
          options: [
            { label: "100%", value: "1" },
            { label: "90%", value: "0.9" },
            { label: "80%", value: "0.8" },
            { label: "70%", value: "0.7" },
            { label: "60%", value: "0.6" },
            { label: "50%", value: "0.5" },
            { label: "40%", value: "0.4" },
            { label: "30%", value: "0.3" },
            { label: "20%", value: "0.2" },
            { label: "10%", value: "0.1" },
          ],
        },
      },
      defaultProps: {
        level: "h1",
        text: "Your Amazing Heading",
        align: "left",
        size: "4xl",
        weight: "bold",
        color: {
          colorKey: "foreground",
        },
        margin: {
          all: "0",
        },
        padding: {
          all: "0",
        },
      },
      render: (props) => <HeadingBlock {...props} />,
    },
    TextBlock: {
      label: "Text",
      fields: {
        text: {
          type: "textarea",
          contentEditable: true,
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        size: {
          type: "select",
          options: [
            { label: "Extra Small", value: "xs" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        weight: {
          type: "select",
          options: [
            { label: "Light", value: "light" },
            { label: "Normal", value: "normal" },
            { label: "Medium", value: "medium" },
            { label: "Semibold", value: "semibold" },
            { label: "Bold", value: "bold" },
          ],
        },
        color: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Muted", value: "muted" },
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Accent", value: "accent" },
            { label: "Destructive", value: "destructive" },
          ],
        },
        leading: {
          type: "select",
          options: [
            { label: "Tight", value: "tight" },
            { label: "Snug", value: "snug" },
            { label: "Normal", value: "normal" },
            { label: "Relaxed", value: "relaxed" },
            { label: "Loose", value: "loose" },
          ],
        },
        as: {
          type: "select",
          options: [
            { label: "Paragraph", value: "p" },
            { label: "Span", value: "span" },
            { label: "Div", value: "div" },
          ],
        },
        listStyle: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Bullet", value: "disc" },
            { label: "Numbered", value: "decimal" },
            { label: "Lowercase Letters", value: "lower-alpha" },
            { label: "Uppercase Letters", value: "upper-alpha" },
            { label: "Lowercase Roman", value: "lower-roman" },
            { label: "Uppercase Roman", value: "upper-roman" },
          ],
        },
        textDecoration: {
          type: "radio",
          options: [
            { label: "None", value: "none" },
            { label: "Underline", value: "underline" },
            { label: "Overline", value: "overline" },
            { label: "Line Through", value: "line-through" },
          ],
        },
        fontStyle: {
          type: "radio",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Italic", value: "italic" },
          ],
        },
      },
      defaultProps: {
        text: "This is a sample paragraph text that you can customize with different styles, sizes, and colors.",
        align: "left",
        size: "md",
        weight: "normal",
        color: "default",
        leading: "normal",
        as: "p",
        listStyle: "none",
        textDecoration: "none",
        fontStyle: "normal",
      },
      render: (props) => <TextBlock {...props} />,
    },
    RichTextBlock: {
      label: "Rich Text Editor",
      fields: {
        content: {
          type: "custom",
          render: ({ onChange, value }) => (
            <RichTextEditor
              editable={true}
              onChange={onChange}
              value={value || ""}
            />
          ),
        },
      },
      defaultProps: {
        content: "<p>Start typing your rich text content here...</p>",
      },
      render: ({ content, className }) => (
        <RichTextBlock content={content} className={className} />
      ),
    },
    GridBlock: {
      label: "Grid",
      fields: {
        columns: {
          type: "select",
          options: [
            { label: "1 Column", value: 1 },
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 },
            { label: "5 Columns", value: 5 },
            { label: "6 Columns", value: 6 },
            { label: "12 Columns", value: 12 },
          ],
        },
        gap: {
          type: "select",
          options: [
            { label: "No Gap", value: "none" },
            { label: "Small Gap", value: "sm" },
            { label: "Medium Gap", value: "md" },
            { label: "Large Gap", value: "lg" },
            { label: "Extra Large Gap", value: "xl" },
          ],
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "background" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        borderRadius: {
          type: "custom",
          render: ({ onChange, value }) => (
            <BorderRadiusField
              value={value || { size: "none" }}
              onChange={onChange}
              label="Border Radius"
            />
          ),
        },
        items: {
          type: "array",
          arrayFields: {
            content: {
              type: "slot",
            },
          },
        },
      },
      defaultProps: {
        columns: 3,
        gap: "md",
      },
      render: ({ items, ...props }) => <GridBlock {...props} items={items} />,
    },
    NavigationBlock: {
      label: "Navigation",
      fields: {
        type: {
          type: "select",
          options: [
            { label: "Header", value: "header" },
            { label: "Sidebar", value: "sidebar" },
            { label: "Mega Menu", value: "mega-menu" },
            { label: "Search First", value: "search-first" },
            { label: "Mobile", value: "mobile" },
          ],
        },
        logo: { type: "text" },
        items: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            label: { type: "text" },
            href: { type: "text" },
            children: {
              type: "array",
              arrayFields: {
                id: { type: "text" },
                label: { type: "text" },
                href: { type: "text" },
                children: {
                  type: "array",
                  arrayFields: {
                    id: { type: "text" },
                    label: { type: "text" },
                    href: { type: "text" },
                  },
                },
              },
            },
          },
        },
        showSearch: {
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
        showCart: {
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
        showWishlist: {
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
        showAccount: {
          type: "radio",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
        cartCount: { type: "number" },
      },
      defaultProps: {
        type: "header",
        logo: "STORE",
        items: [
          {
            id: "1",
            label: "Shop",
            href: "#",
            children: [
              { id: "1-1", label: "New Arrivals", href: "#" },
              { id: "1-2", label: "Clothing", href: "#" },
              { id: "1-3", label: "Accessories", href: "#" },
              { id: "1-4", label: "Sale", href: "#" },
            ],
          },
          { id: "2", label: "Collections", href: "#" },
          { id: "3", label: "About", href: "#" },
          { id: "4", label: "Contact", href: "#" },
        ],
        showSearch: true,
        showCart: true,
        showWishlist: true,
        showAccount: true,
        cartCount: 2,
      },
      render: (props) => <NavigationBlock {...props} />,
    },
    HeroBlock: {
      label: "Hero",
      fields: {
        type: {
          type: "select",
          options: [
            { label: "Hero Type 1 (Side by Side)", value: "hero1" },
            { label: "Hero Type 2 (Mobile Mockup)", value: "hero2" },
          ],
        },
        badge: {
          type: "textarea",
          contentEditable: true,
        },
        heading: {
          type: "textarea",
          contentEditable: true,
        },
        subheading: {
          type: "textarea",
          contentEditable: true,
        },
        description: {
          type: "textarea",
          contentEditable: true,
        },
        buttons: {
          type: "object",
          objectFields: {
            primary: {
              type: "object",
              objectFields: {
                text: { type: "textarea", contentEditable: true },
                url: { type: "text", label: "Button URL" },
              },
            },
            secondary: {
              type: "object",
              objectFields: {
                text: { type: "textarea", contentEditable: true },
                url: { type: "text", label: "Button URL" },
              },
            },
          },
        },
        image: {
          type: "object",
          objectFields: {
            src: { type: "text", label: "Image URL" },
            alt: { type: "text", label: "Alt Text" },
          },
        },
        image2: {
          type: "object",
          objectFields: {
            src: { type: "text", label: "Image URL" },
            alt: { type: "text", label: "Alt Text" },
          },
        },
      },
      defaultProps: {
        type: "hero1",
        badge: "✨ Your Website Builder",
        heading: "Blocks Built With Shadcn & Tailwind",
        subheading: " built with shadcn/ui & Tailwind",
        description:
          "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
        buttons: {
          primary: {
            text: "Get Started",
            url: "#",
          },
          secondary: {
            text: "View on GitHub",
            url: "#",
          },
        },
        image: {
          src: SharedAssets.placeholder,
          alt: "Hero section demo image showing interface components",
        },
        image2: {
          src: SharedAssets.phone,
          alt: "Phone demo image",
        },
      },
      render: (props) => <HeroBlock {...props} />,
    },
    ContainerBlock: {
      label: "Container",
      fields: {
        width: {
          type: "select",
          options: [
            { label: "Full Width", value: "full" },
            { label: "Container", value: "container" },
            { label: "Narrow", value: "narrow" },
            { label: "Wide", value: "wide" },
          ],
        },
        maxWidth: {
          type: "text",
          label: "Max Width (px)",
        },
        padding: {
          type: "object",
          objectFields: {
            top: { type: "text", label: "Top" },
            right: { type: "text", label: "Right" },
            bottom: { type: "text", label: "Bottom" },
            left: { type: "text", label: "Left" },
          },
        },
        margin: {
          type: "object",
          objectFields: {
            top: { type: "text", label: "Top" },
            right: { type: "text", label: "Right" },
            bottom: { type: "text", label: "Bottom" },
            left: { type: "text", label: "Left" },
          },
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "background" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        backgroundImage: {
          type: "text",
          label: "Background Image URL",
        },
        backgroundSize: {
          type: "select",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
            { label: "Auto", value: "auto" },
          ],
        },
        backgroundPosition: {
          type: "select",
          options: [
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
        borderRadius: {
          type: "custom",
          render: ({ onChange, value }) => (
            <BorderRadiusField
              value={value || { size: "none" }}
              onChange={onChange}
              label="Border Radius"
            />
          ),
        },
        border: {
          type: "object",
          objectFields: {
            width: { type: "text", label: "Width" },
            style: {
              type: "select",
              options: [
                { label: "Solid", value: "solid" },
                { label: "Dashed", value: "dashed" },
                { label: "Dotted", value: "dotted" },
              ],
            },
            color: { type: "text", label: "Color" },
          },
        },
        shadow: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        items: {
          type: "array",
          arrayFields: {
            content: {
              type: "slot",
            },
          },
        },
      },
      defaultProps: {
        width: "container",
        padding: {
          top: "24px",
          right: "24px",
          bottom: "24px",
          left: "24px",
        },
        backgroundColor: {
          colorKey: "background",
        },
        shadow: "none",
        items: [
          {
            content: null,
          },
        ],
      },
      render: ({ items, ...props }) => (
        <ContainerBlock {...props} items={items} />
      ),
    },
    FlexBlock: {
      label: "Flex",
      fields: {
        direction: {
          type: "select",
          options: [
            { label: "Row", value: "row" },
            { label: "Column", value: "column" },
            { label: "Row Reverse", value: "row-reverse" },
            { label: "Column Reverse", value: "column-reverse" },
          ],
        },
        wrap: {
          type: "select",
          options: [
            { label: "No Wrap", value: "nowrap" },
            { label: "Wrap", value: "wrap" },
            { label: "Wrap Reverse", value: "wrap-reverse" },
          ],
        },
        justify: {
          type: "select",
          options: [
            { label: "Start", value: "flex-start" },
            { label: "End", value: "flex-end" },
            { label: "Center", value: "center" },
            { label: "Space Between", value: "space-between" },
            { label: "Space Around", value: "space-around" },
            { label: "Space Evenly", value: "space-evenly" },
          ],
        },
        align: {
          type: "select",
          options: [
            { label: "Start", value: "flex-start" },
            { label: "End", value: "flex-end" },
            { label: "Center", value: "center" },
            { label: "Baseline", value: "baseline" },
            { label: "Stretch", value: "stretch" },
          ],
        },
        gap: {
          type: "text",
          label: "Gap (px)",
        },
        width: {
          type: "text",
          label: "Width",
        },
        height: {
          type: "text",
          label: "Height",
        },
        minHeight: {
          type: "text",
          label: "Min Height",
        },
        padding: {
          type: "object",
          objectFields: {
            top: { type: "text", label: "Top" },
            right: { type: "text", label: "Right" },
            bottom: { type: "text", label: "Bottom" },
            left: { type: "text", label: "Left" },
          },
        },
        margin: {
          type: "object",
          objectFields: {
            top: { type: "text", label: "Top" },
            right: { type: "text", label: "Right" },
            bottom: { type: "text", label: "Bottom" },
            left: { type: "text", label: "Left" },
          },
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "background" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        borderRadius: {
          type: "custom",
          render: ({ onChange, value }) => (
            <BorderRadiusField
              value={value || { size: "none" }}
              onChange={onChange}
              label="Border Radius"
            />
          ),
        },
        items: {
          type: "array",
          arrayFields: {
            content: {
              type: "slot",
            },
          },
        },
      },
      defaultProps: {
        direction: "row",
        wrap: "nowrap",
        justify: "flex-start",
        align: "stretch",
        gap: "16px",
        width: "100%",
        padding: {
          top: "16px",
          right: "16px",
          bottom: "16px",
          left: "16px",
        },
        items: [
          {
            content: null,
          },
        ],
      },
      render: ({ items, ...props }) => <FlexBlock {...props} items={items} />,
    },
  },
  categories: {
    typography: {
      components: ["HeadingBlock", "TextBlock", "RichTextBlock"],
    },
    layout: {
      components: ["GridBlock", "ContainerBlock", "FlexBlock"],
    },
  },
};

export default config;
