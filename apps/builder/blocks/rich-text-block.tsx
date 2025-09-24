"use client";

import isHotkey from "is-hotkey";
import React, {
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useMemo,
} from "react";
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import { Button, Icon, Toolbar } from "./slate-components";
import {
  CustomEditor,
  CustomElement,
  CustomElementType,
  CustomElementWithAlign,
  CustomTextKey,
} from "./slate-types";

const HOTKEYS: Record<string, CustomTextKey> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

interface RichTextBlockProps {
  content?: string;
  className?: string;
}

// Rich text editor component for Puck field
export const RichTextEditor = ({
  editable,
  onChange,
  value,
}: {
  editable: boolean;
  onChange: (value: string) => void;
  value: string;
}) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Parse initial value from HTML string
  const initialValue = useMemo(() => {
    if (value) {
      try {
        // Simple HTML to Slate conversion - you might want to use a proper HTML serializer
        return [
          {
            type: "paragraph",
            children: [{ text: value.replace(/<[^>]*>/g, "") }],
          },
        ] as Descendant[];
      } catch {
        return [
          {
            type: "paragraph",
            children: [{ text: "Start typing..." }],
          },
        ] as Descendant[];
      }
    }
    return [
      {
        type: "paragraph",
        children: [{ text: "Start typing..." }],
      },
    ] as Descendant[];
  }, [value]);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      // Convert Slate value to HTML string
      const html = serializeToHtml(newValue);
      onChange(html || "");
    },
    [onChange]
  );

  return (
    <div className="border rounded-md">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleChange}
      >
        {editable && (
          <Toolbar>
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            <BlockButton format="left" icon="format_align_left" />
            <BlockButton format="center" icon="format_align_center" />
            <BlockButton format="right" icon="format_align_right" />
            <BlockButton format="justify" icon="format_align_justify" />
          </Toolbar>
        )}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus={editable}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
          className="min-h-[100px] p-3 focus:outline-none"
        />
      </Slate>
    </div>
  );
};

// Main component for rendering
export function RichTextBlock({ content = "", className }: RichTextBlockProps) {
  return (
    <div className={`container prose prose-sm max-w-none ${className || ""}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

// Helper functions
const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      !!n.type &&
      isListType(n.type as ListType) &&
      !isAlignType(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === "align" && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={style}
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 my-4"
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul
          style={style}
          {...attributes}
          className="list-disc list-inside my-2"
        >
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes} className="text-3xl font-bold my-4">
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes} className="text-2xl font-bold my-3">
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes} className="my-1">
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol
          style={style}
          {...attributes}
          className="list-decimal list-inside my-2"
        >
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes} className="my-2">
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

interface BlockButtonProps {
  format: CustomElementFormat;
  icon: string;
}

const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? "align" : "type"
      )}
      onPointerDown={(event: PointerEvent<HTMLButtonElement>) =>
        event.preventDefault()
      }
      onClick={() => toggleBlock(editor, format)}
      data-test-id={`block-button-${format}`}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

interface MarkButtonProps {
  format: CustomTextKey;
  icon: string;
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onPointerDown={(event: PointerEvent<HTMLButtonElement>) =>
        event.preventDefault()
      }
      onClick={() => toggleMark(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const isAlignType = (format: CustomElementFormat): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (
  element: CustomElement
): element is CustomElementWithAlign => {
  return "align" in element;
};

// Simple HTML serializer - you might want to use a proper HTML serializer library
const serializeToHtml = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      if (SlateElement.isElement(node)) {
        const children = serializeToHtml(node.children);

        switch (node.type) {
          case "heading-one":
            return `<h1>${children}</h1>`;
          case "heading-two":
            return `<h2>${children}</h2>`;
          case "block-quote":
            return `<blockquote>${children}</blockquote>`;
          case "bulleted-list":
            return `<ul>${children}</ul>`;
          case "numbered-list":
            return `<ol>${children}</ol>`;
          case "list-item":
            return `<li>${children}</li>`;
          default:
            return `<p>${children}</p>`;
        }
      } else {
        let text = node.text || "";
        if (node.bold) text = `<strong>${text}</strong>`;
        if (node.italic) text = `<em>${text}</em>`;
        if (node.underline) text = `<u>${text}</u>`;
        if (node.code) text = `<code>${text}</code>`;
        return text;
      }
    })
    .join("");
};
