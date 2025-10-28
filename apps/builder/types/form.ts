export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "number"
    | "tel"
    | "url"
    | "date";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  defaultValue?: string | number | boolean;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  submitAction: {
    type: "newsletter" | "contact" | "survey" | "custom";
    endpoint?: string;
    successMessage?: string;
    errorMessage?: string;
  };
}

export interface FormStyling {
  layout: "vertical" | "horizontal" | "grid";
  spacing: "tight" | "normal" | "loose";
  buttonStyle: "primary" | "secondary" | "outline";
  buttonText: string;
  buttonSize: "sm" | "default" | "lg";
  fieldSpacing: "sm" | "md" | "lg";
}

export interface FormBlockProps {
  template: FormTemplate | string; // Can be template object or template ID
  customFields?: FormField[];
  styling: FormStyling;
  className?: string;
}
