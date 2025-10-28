"use client";

import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { FormBlockProps, FormTemplate } from "../types/form";
import { FormFieldRenderer } from "../components/form-field-renderer";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";
import { FORM_TEMPLATES } from "../data/form-templates";
import { toast } from "sonner";

export function FormBlock({
  template,
  customFields,
  styling,
  className,
}: FormBlockProps) {
  // Resolve template from ID if needed
  const resolvedTemplate: FormTemplate =
    typeof template === "string"
      ? FORM_TEMPLATES.find((t) => t.id === template) || FORM_TEMPLATES[0]
      : template;

  // Combine template fields with custom fields
  const allFields = [...resolvedTemplate.fields, ...(customFields || [])];

  // Create Zod schema from form fields
  const createZodSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    allFields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case "email":
          fieldSchema = z.string().email("Invalid email address");
          break;
        case "number":
          fieldSchema = z.coerce.number();
          break;
        case "checkbox":
          fieldSchema = z.boolean();
          break;
        case "select":
        case "radio":
          fieldSchema = z.string();
          break;
        default:
          fieldSchema = z.string();
      }

      // Make required fields non-optional
      if (field.required && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      } else if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }

      schemaFields[field.id] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(createZodSchema()),
    defaultValues: allFields.reduce(
      (acc, field) => {
        acc[field.id] =
          field.defaultValue || (field.type === "checkbox" ? false : "");
        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const onSubmit = async (data: Record<string, any>) => {
    try {
      const submitData = {
        template: resolvedTemplate.id,
        fields: allFields.map((field) => ({
          id: field.id,
          label: field.label,
          type: field.type,
          value: data[field.id],
        })),
        timestamp: new Date().toISOString(),
      };

      // Handle different submit actions
      switch (resolvedTemplate.submitAction.type) {
        case "newsletter":
          await submitToNewsletter(submitData);
          break;
        case "contact":
          await submitContactForm(submitData);
          break;
        case "survey":
          await submitSurvey(submitData);
          break;
        case "custom":
          if (resolvedTemplate.submitAction.endpoint) {
            await submitToCustomEndpoint(
              resolvedTemplate.submitAction.endpoint,
              submitData
            );
          }
          break;
      }

      // Show success toast
      toast.success(
        resolvedTemplate.submitAction.successMessage ||
          "Form submitted successfully!"
      );

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      // Show error toast
      toast.error(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    }
  };

  // Mock submission functions - replace with actual API calls
  const submitToNewsletter = async (data: any) => {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        resolvedTemplate.submitAction.errorMessage ||
          "Failed to submit newsletter form"
      );
    }
  };

  const submitContactForm = async (data: any) => {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        resolvedTemplate.submitAction.errorMessage ||
          "Failed to submit contact form"
      );
    }
  };

  const submitSurvey = async (data: any) => {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        resolvedTemplate.submitAction.errorMessage || "Failed to submit survey"
      );
    }
  };

  const submitToCustomEndpoint = async (endpoint: string, data: any) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        resolvedTemplate.submitAction.errorMessage ||
          "Failed to submit to custom endpoint"
      );
    }
  };

  const spacingClasses = {
    tight: "space-y-2",
    normal: "space-y-4",
    loose: "space-y-6",
  };

  const layoutClasses = {
    vertical: "flex flex-col",
    horizontal: "grid grid-cols-1 md:grid-cols-2 gap-4",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
  };

  const buttonVariants = {
    primary: "default",
    secondary: "secondary",
    outline: "outline",
  } as const;

  const getButtonSize = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "sm" as const;
      case "md":
        return "default" as const;
      case "lg":
        return "lg" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto",
        spacingClasses[styling.spacing],
        className
      )}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-6", layoutClasses[styling.layout])}
        >
          {allFields.map((field) => (
            <FormFieldRenderer
              key={field.id}
              field={field}
              control={form.control}
            />
          ))}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant={buttonVariants[styling.buttonStyle] as any}
              size={getButtonSize(styling.buttonSize as "sm" | "md" | "lg")}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : styling.buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
