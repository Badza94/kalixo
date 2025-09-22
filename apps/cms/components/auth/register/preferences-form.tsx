"use client";

import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useTranslations } from "next-intl";

import preferences from "@/data/preferences.json";
import { Button } from "@workspace/ui/components/button";

function PreferencesForm({
  onSubmit,
  formData,
}: {
  formData: { preferences?: string[] };
  onSubmit: (data: { preferences: string[] }) => void;
}) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    preferences: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: ft("Errors.requiredToCheckAtLeastOneOption"),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: formData.preferences || [],
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("PreferencesPage.title")}</CardTitle>
        <CardDescription className="text-left">
          {t("PreferencesPage.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Sidebar</FormLabel>
                    <FormDescription>
                      Select the items you want to display in the sidebar.
                    </FormDescription>
                  </div>
                  {preferences.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="preferences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel>
                              {t(`PreferencesPage.options.${item.label}`)}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default PreferencesForm;
