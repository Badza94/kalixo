import type { Config } from "@measured/puck";
import { NavigationBlock } from "./blocks/navigation-block";
import { HeroBlock } from "./blocks/hero-block";
import { SharedAssets } from "@workspace/ui/assets";

type Props = {
  HeadingBlock: { title: string };
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
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
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
          type: "text",
          label: "Badge Text (Hero 1 only)",
        },
        heading: {
          type: "text",
          label: "Main Heading",
        },
        subheading: {
          type: "text",
          label: "Subheading (Hero 2 only)",
        },
        description: {
          type: "textarea",
          label: "Description",
        },
        buttons: {
          type: "object",
          objectFields: {
            primary: {
              type: "object",
              objectFields: {
                text: { type: "text", label: "Button Text" },
                url: { type: "text", label: "Button URL" },
              },
            },
            secondary: {
              type: "object",
              objectFields: {
                text: { type: "text", label: "Button Text" },
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
};

export default config;
