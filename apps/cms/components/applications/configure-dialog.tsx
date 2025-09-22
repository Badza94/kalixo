"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/sonner";
import { Eye, EyeOff } from "@workspace/ui/lucide-react";

interface ApplicationField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
}

interface Application {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | (() => React.ReactNode);
  keyName: string;
  path: string;
  fields: ApplicationField[];
  disabled?: boolean;
  encryptedData?: Record<string, string>;
}

interface ConfigureApplicationDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfigureApplicationDialog({
  application,
  open,
  onOpenChange,
}: ConfigureApplicationDialogProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );
  const t = useTranslations("Applications");
  const fet = useTranslations("Applications.Form.Errors");

  // Create dynamic zod schema based on application fields
  const createFormSchema = (app: Application | null) => {
    if (!app) {
      return z.object({});
    }

    const schemaFields: Record<string, z.ZodTypeAny> = {};

    app.fields.forEach((field) => {
      if (field.type === "password" || field.type === "text") {
        if (field.required) {
          schemaFields[field.name] = z.string().min(1, {
            message: fet("fieldRequired", { field: field.label }),
          });
        } else {
          schemaFields[field.name] = z.string().optional();
        }
      } else {
        schemaFields[field.name] = field.required
          ? z.string().min(1, {
              message: fet("fieldRequired", { field: field.label }),
            })
          : z.string().optional();
      }
    });

    return z.object(schemaFields);
  };

  const formSchema = createFormSchema(application);
  type FormValues = z.infer<typeof formSchema>;

  // Create default values
  const getDefaultValues = (): Partial<FormValues> => {
    if (!application) return {};

    const defaults: any = {};
    const isEditMode = !!application.encryptedData;

    application.fields.forEach((field) => {
      if (isEditMode && application.encryptedData?.[field.name]) {
        defaults[field.name] = application.encryptedData[field.name];
      } else {
        defaults[field.name] = "";
      }
    });

    return defaults;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  // Reset form when application changes
  useEffect(() => {
    if (application) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
      setShowPasswords({});
    }
  }, [application, form]);

  // Early return if no application
  if (!application) return null;

  const isEditMode = !!application.encryptedData;

  const onSubmit = (values: FormValues) => {
    console.log("Application configuration:", {
      application: application.keyName,
      values,
      mode: isEditMode ? "edit" : "configure",
    });

    // Here you would typically make an API call to save the configuration
    toast.success(
      isEditMode
        ? t("messages.configurationUpdated", { app: application.title })
        : t("messages.configurationSaved", { app: application.title })
    );

    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
    setShowPasswords({});
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const IconComponent = application.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {isEditMode
                  ? t("dialog.editTitle", { app: application.title })
                  : t("dialog.configureTitle", { app: application.title })}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription>
            {isEditMode
              ? t("dialog.editDescription", { app: application.title })
              : t("dialog.configureDescription", { app: application.title })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {application.fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as never}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...formField}
                          type={
                            field.type === "password" &&
                            !showPasswords[field.name]
                              ? "password"
                              : "text"
                          }
                          placeholder={
                            field.placeholder ||
                            `${t("enterYour")} ${field.label.toLowerCase()}`
                          }
                          className={field.type === "password" ? "pr-10" : ""}
                        />
                        {field.type === "password" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility(field.name)}
                          >
                            {showPasswords[field.name] ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? t("saving")
                  : isEditMode
                    ? t("updateConfiguration")
                    : t("saveConfiguration")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
