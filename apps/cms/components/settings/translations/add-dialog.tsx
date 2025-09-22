"use client";

import { useState } from "react";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { Plus } from "@workspace/ui/lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

type LocaleOption = {
  value: string;
  label: string;
  icon?: string;
};

interface AddTranslationDialogProps {
  locales: LocaleOption[];
}

// Create dynamic Zod schema based on available locales
const createTranslationSchema = (locales: LocaleOption[]) => {
  const localeFields = locales.reduce(
    (acc, locale) => {
      acc[locale.value] = z
        .string()
        .min(1, `Translation for ${locale.label} is required`);
      return acc;
    },
    {} as Record<string, z.ZodString>
  );

  return z.object({
    translationKey: z
      .string()
      .min(1, "Translation key is required")
      .regex(
        /^[a-zA-Z][a-zA-Z0-9._]*$/,
        "Translation key must start with a letter and contain only letters, numbers, dots, and underscores"
      ),
    translations: z.object(localeFields),
  });
};

export function AddTranslationDialog({ locales }: AddTranslationDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Settings.Translations");
  const tDialog = useTranslations("Settings.Translations.addTranslationDialog");

  const schema = createTranslationSchema(locales);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      translationKey: "",
      translations: locales.reduce(
        (acc, locale) => {
          acc[locale.value] = "";
          return acc;
        },
        {} as Record<string, string>
      ),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: Implement the actual translation saving logic here
      console.log("Translation data:", data);

      // For now, just log the data and close the dialog
      // In a real implementation, you would save this to your translation files
      // or send it to an API endpoint

      setOpen(false);
      form.reset();

      // Show success message
      // toast.success("Translation added successfully!");
    } catch (error) {
      console.error("Error adding translation:", error);
      // toast.error("Failed to add translation");
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("addTranslation")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tDialog("title")}</DialogTitle>
          <DialogDescription>{tDialog("description")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="translationKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tDialog("translationKey")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tDialog("translationKeyPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>{tDialog("translations")}</FormLabel>
                <div className="space-y-4">
                  {locales.map((locale) => (
                    <FormField
                      key={locale.value}
                      control={form.control}
                      name={`translations.${locale.value}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            {locale.icon && (
                              <CircleFlag
                                countryCode={locale.icon.toLowerCase()}
                                height="16"
                                className="h-4 w-4"
                              />
                            )}
                            {locale.label} ({locale.value})
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={tDialog("translationPlaceholder", {
                                locale: locale.label,
                              })}
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {tDialog("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting
              ? tDialog("adding")
              : tDialog("addTranslation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
