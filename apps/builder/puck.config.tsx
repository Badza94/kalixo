import type { Config } from "@measured/puck";
import { NavigationBlock } from "./blocks/navigation-block";
import { HeroBlock } from "./blocks/hero-block";
import { HeadingBlock } from "./blocks/heading-block";
import { TextBlock } from "./blocks/text-block";
import { GridBlock } from "./blocks/grid-block";
import { SharedAssets } from "@workspace/ui/assets";

type Props = {
  HeadingBlock: {
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    text: string;
    className?: string;
    align?: "left" | "center" | "right";
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
    weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
    color?:
      | "default"
      | "muted"
      | "primary"
      | "secondary"
      | "accent"
      | "destructive";
  };
  TextBlock: {
    text: string;
    className?: string;
    align?: "left" | "center" | "right" | "justify";
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
  };
  GridBlock: {
    columns: number;
    gap: "none" | "sm" | "md" | "lg" | "xl";
    className?: string;
    items?: Array<{ content: React.ReactNode | (() => React.ReactNode) }>;
  };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        level: {
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
      },
      defaultProps: {
        level: "h1",
        text: "Your Amazing Heading",
        align: "left",
        size: "4xl",
        weight: "bold",
        color: "default",
      },
      render: (props) => <HeadingBlock {...props} />,
    },
    TextBlock: {
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
      },
      defaultProps: {
        text: "This is a sample paragraph text that you can customize with different styles, sizes, and colors.",
        align: "left",
        size: "md",
        weight: "normal",
        color: "default",
        leading: "normal",
        as: "p",
      },
      render: (props) => <TextBlock {...props} />,
    },
    GridBlock: {
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
      },
      render: (props) => <HeroBlock {...props} />,
    },
  },
  categories: {
    typography: {
      components: ["HeadingBlock", "TextBlock"],
    },
    layout: {
      components: ["GridBlock"],
    },
  },
};

export default config;
