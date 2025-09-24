import { BaseEditor, BaseElement, BaseText } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomElement = BaseElement & {
  type?: string;
  align?: "left" | "center" | "right" | "justify";
};

export type CustomText = BaseText & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "block-quote"
  | "numbered-list"
  | "bulleted-list"
  | "list-item";

export type CustomTextKey = "bold" | "italic" | "underline" | "code";

export type CustomElementWithAlign = CustomElement & {
  align: "left" | "center" | "right" | "justify";
};

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
