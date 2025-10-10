import type { Config } from "@measured/puck";
import {
  NavigationBlock,
  NavigationBlockProps,
} from "./blocks/navigation-block";
import { HeroBlock, HeroBlockProps } from "./blocks/hero-block";
import { HeadingBlock, HeadingBlockProps } from "./blocks/heading-block";
import { TextBlock, TextBlockProps } from "./blocks/text-block";
import {
  RichTextBlock,
  RichTextBlockProps,
  RichTextEditor,
} from "./blocks/rich-text-block";
import { GridBlock, GridBlockProps } from "./blocks/grid-block";
import { ContainerBlock, ContainerBlockProps } from "./blocks/container-block";
import { FlexBlock, FlexBlockProps } from "./blocks/flex-block";
import { ButtonBlock, ButtonBlockProps } from "./blocks/button-block";
import { ImageBlock, ImageBlockProps } from "./blocks/image-block";
import { DividerBlock, DividerBlockProps } from "./blocks/divider-block";
import { CardBlock, CardBlockProps } from "./blocks/card-block";
import { SpacerBlock, SpacerBlockProps } from "./blocks/spacer-block";
import { CarouselBlock, CarouselBlockProps } from "./blocks/carousel-block";
import {
  ProductCardBlock,
  ProductCardBlockProps,
} from "./blocks/product-card-block";
import {
  ProductGridBlock,
  ProductGridBlockProps,
} from "./blocks/product-grid-block";
import { ProductSelectorField } from "./fields/product-selector-field";
import { ColorPickerField } from "./fields/color-picker-field";
import { SpacingField } from "./fields/spacing-field";
import { BorderRadiusField } from "./fields/border-radius-field";
import { ImagePickerField } from "./fields/image-picker-field";
import { SharedAssets } from "@workspace/ui/assets";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

type Props = {
  HeadingBlock: HeadingBlockProps;
  TextBlock: TextBlockProps;
  RichTextBlock: RichTextBlockProps;
  NavigationBlock: NavigationBlockProps;
  HeroBlock: HeroBlockProps;
  GridBlock: GridBlockProps;
  ContainerBlock: ContainerBlockProps;
  FlexBlock: FlexBlockProps;
  ButtonBlock: ButtonBlockProps;
  ImageBlock: ImageBlockProps;
  SpacerBlock: SpacerBlockProps;
  DividerBlock: DividerBlockProps;
  CardBlock: CardBlockProps;
  CarouselBlock: CarouselBlockProps;
  ProductCardBlock: ProductCardBlockProps;
  ProductGridBlock: ProductGridBlockProps;
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
    ButtonBlock: {
      label: "Button",
      fields: {
        text: {
          type: "text",
          label: "Button Text",
        },
        href: {
          type: "text",
          label: "Link URL (optional)",
        },
        variant: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Destructive", value: "destructive" },
            { label: "Outline", value: "outline" },
            { label: "Secondary", value: "secondary" },
            { label: "Ghost", value: "ghost" },
            { label: "Link", value: "link" },
          ],
        },
        size: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Small", value: "sm" },
            { label: "Large", value: "lg" },
            { label: "Icon", value: "icon" },
          ],
        },
        disabled: {
          type: "radio",
          options: [
            { label: "Enabled", value: false },
            { label: "Disabled", value: true },
          ],
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "primary" }}
              onChange={onChange}
              label="Background Color (overrides variant)"
            />
          ),
        },
        textColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "primary-foreground" }}
              onChange={onChange}
              label="Text Color"
            />
          ),
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
      },
      defaultProps: {
        text: "Click me",
        variant: "default",
        size: "default",
        disabled: false,
      },
      render: (props) => <ButtonBlock {...props} />,
    },
    ImageBlock: {
      label: "Image",
      fields: {
        src: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ImagePickerField
              value={value || ""}
              onChange={onChange}
              label="Image"
            />
          ),
        },
        alt: {
          type: "text",
          label: "Alt Text",
        },
        fill: {
          type: "radio",
          options: [
            { label: "Fixed Size", value: false },
            { label: "Fill Container", value: true },
          ],
        },
        width: {
          type: "number",
          label: "Width (px)",
        },
        height: {
          type: "number",
          label: "Height (px)",
        },
        maxWidth: {
          type: "text",
          label: "Max Width",
        },
        aspectRatio: {
          type: "select",
          options: [
            { label: "Auto (use width/height)", value: "auto" },
            { label: "16:9 (Widescreen)", value: "16/9" },
            { label: "4:3 (Standard)", value: "4/3" },
            { label: "1:1 (Square)", value: "1/1" },
            { label: "3:2 (Classic Photo)", value: "3/2" },
            { label: "21:9 (Ultrawide)", value: "21/9" },
            { label: "Custom", value: "custom" },
          ],
        },
        customAspectRatio: {
          type: "text",
          label: "Custom Aspect Ratio (e.g., 1.5)",
        },
        objectFit: {
          type: "select",
          options: [
            { label: "Contain", value: "contain" },
            { label: "Cover", value: "cover" },
            { label: "Fill", value: "fill" },
            { label: "None", value: "none" },
            { label: "Scale Down", value: "scale-down" },
          ],
        },
        objectPosition: {
          type: "select",
          options: [
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
            { label: "Top Left", value: "top left" },
            { label: "Top Right", value: "top right" },
            { label: "Bottom Left", value: "bottom left" },
            { label: "Bottom Right", value: "bottom right" },
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
        shadow: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
            { label: "2XL", value: "2xl" },
          ],
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
        opacity: {
          type: "text",
          label: "Opacity (0-1)",
        },
        grayscale: {
          type: "radio",
          options: [
            { label: "Color", value: false },
            { label: "Grayscale", value: true },
          ],
        },
        priority: {
          type: "radio",
          options: [
            { label: "Lazy Load", value: false },
            { label: "Priority (for above fold)", value: true },
          ],
        },
        quality: {
          type: "number",
          label: "Quality (1-100)",
        },
      },
      defaultProps: {
        src: SharedAssets.placeholder,
        alt: "Image description",
        width: 800,
        height: 600,
        aspectRatio: "16/9",
        fill: false,
        objectFit: "cover",
        objectPosition: "center",
        priority: false,
        quality: 75,
      },
      render: (props) => <ImageBlock {...props} />,
    },
    SpacerBlock: {
      label: "Spacer",
      fields: {
        height: {
          type: "text",
          label: "Height",
        },
        width: {
          type: "text",
          label: "Width",
        },
      },
      defaultProps: {
        height: "24px",
        width: "100%",
      },
      render: (props) => <SpacerBlock {...props} />,
    },
    DividerBlock: {
      label: "Divider",
      fields: {
        orientation: {
          type: "radio",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
        color: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "border" }}
              onChange={onChange}
              label="Color"
            />
          ),
        },
        thickness: {
          type: "text",
          label: "Thickness",
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
      },
      defaultProps: {
        orientation: "horizontal",
        decorative: true,
      },
      render: (props) => <DividerBlock {...props} />,
    },
    CardBlock: {
      label: "Card",
      fields: {
        showHeader: {
          type: "radio",
          options: [
            { label: "Show Header", value: true },
            { label: "Hide Header", value: false },
          ],
        },
        title: {
          type: "text",
          label: "Card Title",
        },
        description: {
          type: "textarea",
          label: "Card Description",
        },
        showFooter: {
          type: "radio",
          options: [
            { label: "Show Footer", value: true },
            { label: "Hide Footer", value: false },
          ],
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "card" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        borderColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "border" }}
              onChange={onChange}
              label="Border Color"
            />
          ),
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
        margin: {
          type: "object",
          objectFields: {
            top: { type: "text", label: "Top" },
            right: { type: "text", label: "Right" },
            bottom: { type: "text", label: "Bottom" },
            left: { type: "text", label: "Left" },
          },
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
        items: {
          type: "array",
          arrayFields: {
            content: {
              type: "slot",
            },
          },
        },
        footerItems: {
          type: "array",
          arrayFields: {
            content: {
              type: "slot",
            },
          },
        },
      },
      defaultProps: {
        showHeader: true,
        title: "Card Title",
        description: "Card description goes here",
        showFooter: false,
        items: [{ content: null }],
      },
      render: ({ items, footerItems, ...props }) => (
        <CardBlock {...props} items={items} footerItems={footerItems} />
      ),
    },
    CarouselBlock: {
      label: "Carousel",
      fields: {
        itemsPerSlide: {
          type: "select",
          options: [
            { label: "1 Item Per Slide", value: 1 },
            { label: "2 Items Per Slide", value: 2 },
            { label: "3 Items Per Slide", value: 3 },
            { label: "4 Items Per Slide", value: 4 },
            { label: "5 Items Per Slide", value: 5 },
            { label: "6 Items Per Slide", value: 6 },
          ],
        },
        orientation: {
          type: "radio",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
        showNavigation: {
          type: "radio",
          options: [
            { label: "Show Navigation", value: true },
            { label: "Hide Navigation", value: false },
          ],
        },
        showDots: {
          type: "radio",
          options: [
            { label: "Show Dot Indicators", value: true },
            { label: "Hide Dot Indicators", value: false },
          ],
        },
        showCounter: {
          type: "radio",
          options: [
            { label: "Show Slide Counter", value: true },
            { label: "Hide Slide Counter", value: false },
          ],
        },
        loop: {
          type: "radio",
          options: [
            { label: "Loop", value: true },
            { label: "No Loop", value: false },
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
        itemGap: {
          type: "select",
          options: [
            { label: "No Gap", value: "none" },
            { label: "Small Gap", value: "sm" },
            { label: "Medium Gap", value: "md" },
            { label: "Large Gap", value: "lg" },
            { label: "Extra Large Gap", value: "xl" },
          ],
        },
        itemMinHeight: {
          type: "text",
          label: "Item Min Height (e.g., 300px)",
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "background" }}
              onChange={onChange}
              label="Container Background Color"
            />
          ),
        },
        itemBackgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "card" }}
              onChange={onChange}
              label="Item Background Color"
            />
          ),
        },
        borderRadius: {
          type: "custom",
          render: ({ onChange, value }) => (
            <BorderRadiusField
              value={value || { size: "md" }}
              onChange={onChange}
              label="Border Radius"
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
              label="Container Padding"
            />
          ),
        },
        itemPadding: {
          type: "custom",
          render: ({ onChange, value }) => (
            <SpacingField
              value={value || { all: "16px" }}
              onChange={onChange}
              label="Item Padding"
            />
          ),
        },
        items: {
          type: "array",
          getItemSummary: (item, index) =>
            `Slide ${(index ?? 0) + 1}${item?.contents?.length ? ` (${item.contents.length} component${item.contents.length !== 1 ? "s" : ""})` : ""}`,
          arrayFields: {
            contents: {
              type: "array",
              getItemSummary: (item, index) => `Component ${(index ?? 0) + 1}`,
              arrayFields: {
                content: {
                  type: "slot",
                },
              },
            },
          },
        },
      },
      defaultProps: {
        itemsPerSlide: 1,
        orientation: "horizontal",
        showNavigation: true,
        showDots: false,
        showCounter: true,
        loop: true,
        gap: "md",
        itemGap: "md",
        itemMinHeight: "300px",
        itemPadding: { all: "16px" },
        items: [{ contents: [{ content: null }] }],
      },
      render: ({ items, ...props }) => (
        <CarouselBlock {...props} items={items} />
      ),
    },
    ProductCardBlock: {
      label: "Product Card",
      fields: {
        productId: {
          type: "text",
          label: "Product ID (e.g., 17056)",
        },
        showCategory: {
          type: "radio",
          options: [
            { label: "Show Category", value: true },
            { label: "Hide Category", value: false },
          ],
        },
        showPrice: {
          type: "radio",
          options: [
            { label: "Show Price", value: true },
            { label: "Hide Price", value: false },
          ],
        },
        showButtons: {
          type: "radio",
          options: [
            { label: "Show Buttons", value: true },
            { label: "Hide Buttons", value: false },
          ],
        },
        buttonLayout: {
          type: "select",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
            { label: "Icons Only", value: "icons-only" },
          ],
        },
        imageSize: {
          type: "object",
          objectFields: {
            width: {
              type: "number",
              label: "Image Width (e.g., 176, 200)",
            },
            height: {
              type: "number",
              label: "Image Height (e.g., 176, 200)",
            },
          },
        },
        imageWrapper: {
          type: "object",
          objectFields: {
            padding: {
              type: "custom",
              render: ({ onChange, value }) => (
                <SpacingField
                  value={value || { all: "0" }}
                  onChange={onChange}
                  label="Image Wrapper Padding"
                />
              ),
            },
            borderRadius: {
              type: "custom",
              render: ({ onChange, value }) => (
                <BorderRadiusField
                  value={value || { size: "none" }}
                  onChange={onChange}
                  label="Image Wrapper Border Radius"
                />
              ),
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "transparent" }}
                  onChange={onChange}
                  label="Image Wrapper Background Color"
                />
              ),
            },
          },
        },
        buyNowButton: {
          type: "object",
          objectFields: {
            variant: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Destructive", value: "destructive" },
                { label: "Outline", value: "outline" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
                { label: "Input", value: "input" },
                { label: "Text", value: "text" },
              ],
            },
            size: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "sm" },
                { label: "Large", value: "lg" },
                { label: "Icon", value: "icon" },
              ],
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "primary" }}
                  onChange={onChange}
                  label="Background Color"
                />
              ),
            },
            textColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "primary-foreground" }}
                  onChange={onChange}
                  label="Text Color"
                />
              ),
            },
          },
        },
        addToCartButton: {
          type: "object",
          objectFields: {
            variant: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Destructive", value: "destructive" },
                { label: "Outline", value: "outline" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
                { label: "Input", value: "input" },
                { label: "Text", value: "text" },
              ],
            },
            size: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "sm" },
                { label: "Large", value: "lg" },
                { label: "Icon", value: "icon" },
              ],
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "transparent" }}
                  onChange={onChange}
                  label="Background Color"
                />
              ),
            },
            textColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "foreground" }}
                  onChange={onChange}
                  label="Text Color"
                />
              ),
            },
          },
        },
        addToFavButton: {
          type: "object",
          objectFields: {
            variant: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Destructive", value: "destructive" },
                { label: "Outline", value: "outline" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
                { label: "Input", value: "input" },
                { label: "Text", value: "text" },
              ],
            },
            size: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "sm" },
                { label: "Large", value: "lg" },
                { label: "Icon", value: "icon" },
              ],
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "transparent" }}
                  onChange={onChange}
                  label="Background Color"
                />
              ),
            },
            textColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "foreground" }}
                  onChange={onChange}
                  label="Text Color"
                />
              ),
            },
          },
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "card" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        borderRadius: {
          type: "custom",
          render: ({ onChange, value }) => (
            <BorderRadiusField
              value={value || { size: "lg" }}
              onChange={onChange}
              label="Border Radius"
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
        // padding: {
        //   type: "custom",
        //   render: ({ onChange, value }) => (
        //     <SpacingField
        //       value={value || { all: "0" }}
        //       onChange={onChange}
        //       label="Padding"
        //     />
        //   ),
        // },
      },
      defaultProps: {
        productId: "17056",
        showCategory: true,
        showPrice: true,
        showButtons: true,
        buttonLayout: "horizontal",
        buyNowButton: {
          variant: "default",
          size: "default",
          backgroundColor: { colorKey: "primary" },
          textColor: { colorKey: "primary-foreground" },
        },
        addToCartButton: {
          variant: "ghost",
          size: "sm",
          backgroundColor: { colorKey: "transparent" },
          textColor: { colorKey: "foreground" },
        },
        addToFavButton: {
          variant: "ghost",
          size: "sm",
          backgroundColor: { colorKey: "transparent" },
          textColor: { colorKey: "foreground" },
        },
        imageSize: {
          width: 176,
          height: 176,
        },
        imageWrapper: {
          padding: { all: "0" },
          borderRadius: { size: "none" },
          backgroundColor: { colorKey: "transparent" },
        },
        borderRadius: { size: "lg" },
        // padding: { all: "0" },
      },
      render: (props) => <ProductCardBlock {...props} />,
    },
    ProductGridBlock: {
      label: "Product Grid",
      fields: {
        productSelection: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ProductSelectorField
              value={
                value || {
                  selectionMode: "manual",
                  selectedProducts: [],
                  filters: {},
                  maxProducts: 6,
                }
              }
              onChange={onChange}
              label="Product Selection"
            />
          ),
        },
        gridColumns: {
          type: "select",
          options: [
            { label: "1 Column", value: 1 },
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 },
            { label: "5 Columns", value: 5 },
            { label: "6 Columns", value: 6 },
          ],
        },
        showCategory: {
          type: "radio",
          options: [
            { label: "Show Category", value: true },
            { label: "Hide Category", value: false },
          ],
        },
        showPrice: {
          type: "radio",
          options: [
            { label: "Show Price", value: true },
            { label: "Hide Price", value: false },
          ],
        },
        showButtons: {
          type: "radio",
          options: [
            { label: "Show Buttons", value: true },
            { label: "Hide Buttons", value: false },
          ],
        },
        buttonLayout: {
          type: "select",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
            { label: "Icons Only", value: "icons-only" },
          ],
        },
        buyNowButton: {
          type: "object",
          objectFields: {
            variant: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Destructive", value: "destructive" },
                { label: "Outline", value: "outline" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
                { label: "Input", value: "input" },
                { label: "Text", value: "text" },
              ],
            },
            size: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "sm" },
                { label: "Large", value: "lg" },
                { label: "Icon", value: "icon" },
              ],
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "primary" }}
                  onChange={onChange}
                  label="Background Color"
                />
              ),
            },
            textColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "primary-foreground" }}
                  onChange={onChange}
                  label="Text Color"
                />
              ),
            },
          },
        },
        addToCartButton: {
          type: "object",
          objectFields: {
            variant: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Destructive", value: "destructive" },
                { label: "Outline", value: "outline" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
                { label: "Input", value: "input" },
                { label: "Text", value: "text" },
              ],
            },
            size: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "sm" },
                { label: "Large", value: "lg" },
                { label: "Icon", value: "icon" },
              ],
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "transparent" }}
                  onChange={onChange}
                  label="Background Color"
                />
              ),
            },
            textColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "foreground" }}
                  onChange={onChange}
                  label="Text Color"
                />
              ),
            },
          },
        },
        addToFavButton: {
          type: "object",
          objectFields: {
            variant: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Destructive", value: "destructive" },
                { label: "Outline", value: "outline" },
                { label: "Secondary", value: "secondary" },
                { label: "Ghost", value: "ghost" },
                { label: "Link", value: "link" },
                { label: "Input", value: "input" },
                { label: "Text", value: "text" },
              ],
            },
            size: {
              type: "select",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "sm" },
                { label: "Large", value: "lg" },
                { label: "Icon", value: "icon" },
              ],
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "transparent" }}
                  onChange={onChange}
                  label="Background Color"
                />
              ),
            },
            textColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "foreground" }}
                  onChange={onChange}
                  label="Text Color"
                />
              ),
            },
          },
        },
        backgroundColor: {
          type: "custom",
          render: ({ onChange, value }) => (
            <ColorPickerField
              value={value || { colorKey: "card" }}
              onChange={onChange}
              label="Background Color"
            />
          ),
        },
        borderRadius: {
          type: "custom",
          render: ({ onChange, value }) => (
            <BorderRadiusField
              value={value || { size: "lg" }}
              onChange={onChange}
              label="Border Radius"
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
              value={value || { all: "0" }}
              onChange={onChange}
              label="Padding"
            />
          ),
        },
        imageAspectRatio: {
          type: "select",
          options: [
            { label: "Square (1:1)", value: "square" },
            { label: "4:3", value: "4/3" },
            { label: "3:2", value: "3/2" },
            { label: "16:9", value: "16/9" },
          ],
        },
        imageSize: {
          type: "object",
          objectFields: {
            width: {
              type: "number",
              label: "Image Width (e.g., 176, 200)",
            },
            height: {
              type: "number",
              label: "Image Height (e.g., 176, 200)",
            },
          },
        },
        imageWrapper: {
          type: "object",
          objectFields: {
            padding: {
              type: "custom",
              render: ({ onChange, value }) => (
                <SpacingField
                  value={value || { all: "0" }}
                  onChange={onChange}
                  label="Image Wrapper Padding"
                />
              ),
            },
            borderRadius: {
              type: "custom",
              render: ({ onChange, value }) => (
                <BorderRadiusField
                  value={value || { size: "none" }}
                  onChange={onChange}
                  label="Image Wrapper Border Radius"
                />
              ),
            },
            backgroundColor: {
              type: "custom",
              render: ({ onChange, value }) => (
                <ColorPickerField
                  value={value || { colorKey: "transparent" }}
                  onChange={onChange}
                  label="Image Wrapper Background Color"
                />
              ),
            },
          },
        },
      },
      defaultProps: {
        productSelection: {
          selectionMode: "manual",
          selectedProducts: [],
          filters: {},
          maxProducts: 6,
        },
        gridColumns: 3,
        showCategory: true,
        showPrice: true,
        showButtons: true,
        buttonLayout: "horizontal",
        buyNowButton: {
          variant: "default",
          size: "default",
          backgroundColor: { colorKey: "primary" },
          textColor: { colorKey: "primary-foreground" },
        },
        addToCartButton: {
          variant: "ghost",
          size: "sm",
          backgroundColor: { colorKey: "transparent" },
          textColor: { colorKey: "foreground" },
        },
        addToFavButton: {
          variant: "ghost",
          size: "sm",
          backgroundColor: { colorKey: "transparent" },
          textColor: { colorKey: "foreground" },
        },
        imageAspectRatio: "square",
        imageSize: {
          width: 176,
          height: 176,
        },
        imageWrapper: {
          padding: { all: "0" },
          borderRadius: { size: "none" },
          backgroundColor: { colorKey: "transparent" },
        },
        borderRadius: { size: "lg" },
        padding: { all: "0" },
      },
      render: (props) => <ProductGridBlock {...props} />,
    },
  },
  categories: {
    typography: {
      components: ["HeadingBlock", "TextBlock", "RichTextBlock"],
    },
    layout: {
      components: ["GridBlock", "ContainerBlock", "FlexBlock"],
    },
    components: {
      components: [
        "ButtonBlock",
        "ImageBlock",
        "CardBlock",
        "CarouselBlock",
        "ProductCardBlock",
        "ProductGridBlock",
        "DividerBlock",
        "SpacerBlock",
      ],
    },
  },
};

export default config;
