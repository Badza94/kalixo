"use client";

import { Control } from "@workspace/ui/lib/react-hook-form";
import { FormField, FormStyling } from "../types/form";
import { Input } from "@workspace/ui/components/input";
import { PasswordInput } from "@workspace/ui/components/password-input";
import { Textarea } from "@workspace/ui/components/textarea";
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
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { resolveColor } from "../types/theme";
import { useThemeConfig } from "../hooks/use-theme-config";

interface FormFieldRendererProps {
  field: FormField;
  control: Control<any>;
  styling?: FormStyling;
}

export function FormFieldRenderer({
  field,
  control,
  styling,
}: FormFieldRendererProps) {
  const fieldId = `field-${field.id}`;
  const isRequired = field.required;
  const { themeConfig } = useThemeConfig();

  // Build input styles
  const inputStyle: React.CSSProperties = styling?.inputStyles
    ? {
        ...(styling.inputStyles.backgroundColor && {
          backgroundColor: resolveColor(
            styling.inputStyles.backgroundColor.colorKey,
            styling.inputStyles.backgroundColor.customColor,
            themeConfig || undefined,
            "light"
          ),
        }),
        ...(styling.inputStyles.textColor && {
          color: resolveColor(
            styling.inputStyles.textColor.colorKey,
            styling.inputStyles.textColor.customColor,
            themeConfig || undefined,
            "light"
          ),
        }),
        ...(styling.inputStyles.borderColor && {
          borderColor: resolveColor(
            styling.inputStyles.borderColor.colorKey,
            styling.inputStyles.borderColor.customColor,
            themeConfig || undefined,
            "light"
          ),
        }),
        ...(styling.inputStyles.borderWidth && {
          borderWidth: styling.inputStyles.borderWidth,
        }),
        ...(styling.inputStyles.borderRadius && {
          borderRadius: styling.inputStyles.borderRadius,
        }),
      }
    : {};

  // Build label styles
  const labelStyle: React.CSSProperties = styling?.labelStyles
    ? {
        ...(styling.labelStyles.textColor && {
          color: resolveColor(
            styling.labelStyles.textColor.colorKey,
            styling.labelStyles.textColor.customColor,
            themeConfig || undefined,
            "light"
          ),
        }),
        ...(styling.labelStyles.fontSize && {
          fontSize: styling.labelStyles.fontSize,
        }),
        ...(styling.labelStyles.fontWeight && {
          fontWeight: styling.labelStyles.fontWeight,
        }),
      }
    : {};

  return (
    <ShadcnFormField
      control={control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          {field.type !== "checkbox" && (
            <FormLabel className="text-sm font-medium" style={labelStyle}>
              {field.label}
              {isRequired && <span className="ml-1 text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {field.type === "password" ? (
              <PasswordInput
                id={fieldId}
                placeholder={field.placeholder}
                {...formField}
                style={inputStyle}
              />
            ) : field.type === "text" ||
              field.type === "email" ||
              field.type === "tel" ||
              field.type === "url" ||
              field.type === "date" ? (
              <Input
                id={fieldId}
                type={field.type}
                placeholder={field.placeholder}
                {...formField}
                style={inputStyle}
              />
            ) : field.type === "number" ? (
              <Input
                id={fieldId}
                type="number"
                placeholder={field.placeholder}
                {...formField}
                onChange={(e) => formField.onChange(Number(e.target.value))}
                style={inputStyle}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                id={fieldId}
                placeholder={field.placeholder}
                {...formField}
                rows={4}
                style={inputStyle}
              />
            ) : field.type === "select" ? (
              <Select
                value={formField.value || ""}
                onValueChange={formField.onChange}
              >
                <SelectTrigger>
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
            ) : field.type === "radio" ? (
              <RadioGroup
                value={formField.value || ""}
                onValueChange={formField.onChange}
              >
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${fieldId}-${option}`}
                    />
                    <label htmlFor={`${fieldId}-${option}`}>{option}</label>
                  </div>
                ))}
              </RadioGroup>
            ) : field.type === "checkbox" ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={fieldId}
                    checked={formField.value || false}
                    onCheckedChange={formField.onChange}
                    style={{
                      ...(styling?.inputStyles?.borderColor && {
                        borderColor: resolveColor(
                          styling.inputStyles.borderColor.colorKey,
                          styling.inputStyles.borderColor.customColor,
                          themeConfig || undefined,
                          "light"
                        ),
                      }),
                      ...(styling?.inputStyles?.borderWidth && {
                        borderWidth: styling.inputStyles.borderWidth,
                      }),
                      ...(styling?.inputStyles?.borderRadius && {
                        borderRadius: styling.inputStyles.borderRadius,
                      }),
                    }}
                  />
                  <label
                    htmlFor={fieldId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    style={labelStyle}
                  >
                    {field.label}
                  </label>
                </div>
                {field.inlineLink && (
                  <a
                    href={field.inlineLink.href}
                    className="text-sm text-primary hover:underline"
                  >
                    {field.inlineLink.text}
                  </a>
                )}
              </div>
            ) : (
              <Input
                id={fieldId}
                type="text"
                placeholder={field.placeholder}
                {...formField}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
