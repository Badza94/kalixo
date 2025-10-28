"use client";

import { useState } from "react";
import { FormBlockProps, FormField, FormTemplate } from "../types/form";
import { FormFieldRenderer } from "../components/form-field-renderer";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { CheckCircle } from "@workspace/ui/lucide-react";
import { FORM_TEMPLATES } from "../data/form-templates";

export function FormBlock({
  template,
  customFields,
  styling,
  className,
}: FormBlockProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Resolve template from ID if needed
  const resolvedTemplate: FormTemplate =
    typeof template === "string"
      ? FORM_TEMPLATES.find((t) => t.id === template) || FORM_TEMPLATES[0]
      : template;

  // Merge template fields with custom fields
  const allFields = [...resolvedTemplate.fields, ...(customFields || [])];

  const validateField = (field: FormField, value: any): string | null => {
    if (
      field.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, min, max } = field.validation;

      if (typeof value === "string") {
        if (minLength && value.length < minLength) {
          return `${field.label} must be at least ${minLength} characters`;
        }
        if (maxLength && value.length > maxLength) {
          return `${field.label} must be no more than ${maxLength} characters`;
        }
        if (pattern && !new RegExp(pattern).test(value)) {
          return `${field.label} format is invalid`;
        }
      }

      if (typeof value === "number") {
        if (min !== undefined && value < min) {
          return `${field.label} must be at least ${min}`;
        }
        if (max !== undefined && value > max) {
          return `${field.label} must be no more than ${max}`;
        }
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    allFields.forEach((field) => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        template: resolvedTemplate.id,
        fields: allFields.map((field) => ({
          id: field.id,
          label: field.label,
          type: field.type,
          value: formData[field.id],
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

      setIsSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // You could show a toast notification here
    } finally {
      setIsSubmitting(false);
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
      throw new Error("Failed to submit newsletter form");
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
      throw new Error("Failed to submit contact form");
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
      throw new Error("Failed to submit survey");
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
      throw new Error("Failed to submit to custom endpoint");
    }
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "p-6 text-center bg-green-50 rounded-lg border border-green-200",
          className
        )}
      >
        <CheckCircle className="mx-auto mb-2 w-8 h-8 text-green-600" />
        <p className="font-medium text-green-800">
          {resolvedTemplate.submitAction.successMessage}
        </p>
      </div>
    );
  }

  const spacingClasses = {
    tight: "space-y-2",
    normal: "space-y-4",
    loose: "space-y-6",
  };

  const fieldSpacingClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const layoutClasses = {
    vertical: "flex flex-col",
    horizontal: "grid grid-cols-1 md:grid-cols-2 gap-4",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4", spacingClasses[styling.spacing], className)}
    >
      <div
        className={cn(
          layoutClasses[styling.layout],
          fieldSpacingClasses[styling.fieldSpacing]
        )}
      >
        {allFields.map((field) => (
          <FormFieldRenderer
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={errors[field.id]}
          />
        ))}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant={
            styling.buttonStyle === "primary" ? "default" : styling.buttonStyle
          }
          size={styling.buttonSize}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 w-4 h-4 rounded-full border-b-2 border-white animate-spin" />
              Submitting...
            </>
          ) : (
            styling.buttonText
          )}
        </Button>
      </div>
    </form>
  );
}
