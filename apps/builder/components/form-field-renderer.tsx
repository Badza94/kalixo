"use client";

import { FormField } from "../types/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface FormFieldRendererProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
}: FormFieldRendererProps) {
  const fieldId = `field-${field.id}`;
  const isRequired = field.required;

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
      case "number":
      case "date":
        return (
          <Input
            id={fieldId}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
            className={error ? "border-red-500" : ""}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={fieldId}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
            className={error ? "border-red-500" : ""}
            rows={4}
          />
        );

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue
                placeholder={field.placeholder || "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup value={value || ""} onValueChange={onChange}>
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${fieldId}-${option}`} />
                <Label htmlFor={`${fieldId}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldId}-${option}`}
                  checked={
                    Array.isArray(value) ? value.includes(option) : false
                  }
                  onCheckedChange={(checked) => {
                    if (Array.isArray(value)) {
                      if (checked) {
                        onChange?.([...value, option]);
                      } else {
                        onChange?.(value.filter((v) => v !== option));
                      }
                    } else {
                      onChange?.(checked ? [option] : []);
                    }
                  }}
                />
                <Label htmlFor={`${fieldId}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            id={fieldId}
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
            className={error ? "border-red-500" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {field.label}
        {isRequired && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
