"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@workspace/ui/hookform";

import { useForm } from "@workspace/ui/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Link } from "@/i18n/routing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    email: z.string().email({ message: ft("Errors.invalidEmail") }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("ForgotPasswordPage.forgotPassword")}
          </CardTitle>
          <CardDescription className="text-left">
            {t("ForgotPasswordPage.resetPassword")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ft("email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {t("ForgotPasswordPage.sendEmail")}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t("ForgotPasswordPage.backToLogin")}{" "}
                <Link href="/register" className="underline underline-offset-4">
                  {t("signIn")}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        {t.rich("agreeTo", {
          terms: (chunks) => <Link href="#">{chunks}</Link>,
          privacy: (chunks) => <Link href="#">{chunks}</Link>,
        })}
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
