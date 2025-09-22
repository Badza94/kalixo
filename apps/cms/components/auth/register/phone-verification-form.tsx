"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

function PhoneVerificationForm({
  onSubmit,
  formData,
}: {
  className?: string;
  formData: { phone?: string };
  onSubmit: (data: { phone: string }) => void;
}) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    phone: z
      .string()
      .min(1, { message: ft("Errors.requiredPhone") })
      .regex(/^\+?[1-9]\d{1,14}$/, { message: ft("Errors.invalidPhone") }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: formData.phone || "",
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {t("PhoneVerificationPage.title")}
        </CardTitle>
        <CardDescription className="text-left">
          {t("PhoneVerificationPage.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ft("phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={ft("phonePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t("continue")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default PhoneVerificationForm;
