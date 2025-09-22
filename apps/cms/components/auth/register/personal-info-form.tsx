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

function PersonalInfoForm({
  onSubmit,
  formData,
}: {
  className?: string;
  formData: { firstName?: string; lastName?: string };
  onSubmit: (data: { firstName: string; lastName: string }) => void;
}) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    firstName: z.string().min(1, { message: ft("Errors.requiredFirstName") }),
    lastName: z.string().min(1, { message: ft("Errors.requiredLastName") }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {t("PersonalInformationPage.title")}
        </CardTitle>
        <CardDescription className="text-left">
          {t("PersonalInformationPage.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ft("firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ft("firstNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ft("lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={ft("lastNamePlaceholder")}
                        {...field}
                      />
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

export default PersonalInfoForm;
