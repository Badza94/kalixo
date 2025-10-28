"use client";

import { Control } from "@workspace/ui/lib/react-hook-form";
import { FormField } from "../types/form";
import { Input } from "@workspace/ui/components/input";
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

interface FormFieldRendererProps {
  field: FormField;
  control: Control<any>;
}

export function FormFieldRenderer({ field, control }: FormFieldRendererProps) {
  const fieldId = `field-${field.id}`;
  const isRequired = field.required;

  return (
    <ShadcnFormField
      control={control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {field.label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {field.type === "text" ||
            field.type === "email" ||
            field.type === "tel" ||
            field.type === "url" ||
            field.type === "date" ? (
              <Input
                id={fieldId}
                type={field.type}
                placeholder={field.placeholder}
                {...formField}
              />
            ) : field.type === "number" ? (
              <Input
                id={fieldId}
                type="number"
                placeholder={field.placeholder}
                {...formField}
                onChange={(e) => formField.onChange(Number(e.target.value))}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                id={fieldId}
                placeholder={field.placeholder}
                {...formField}
                rows={4}
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
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${fieldId}-${option}`}
                      checked={
                        Array.isArray(formField.value)
                          ? formField.value.includes(option)
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const currentValue = Array.isArray(formField.value)
                          ? formField.value
                          : [];
                        if (checked) {
                          formField.onChange([...currentValue, option]);
                        } else {
                          formField.onChange(
                            currentValue.filter((v: string) => v !== option)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`${fieldId}-${option}`}>{option}</label>
                  </div>
                ))}
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
