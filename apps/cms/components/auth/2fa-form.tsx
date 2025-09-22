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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Link } from "@/i18n/routing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";

function TwoFaForm({
  className,
  onSubmit,
}: {
  className?: string;
  onSubmit: (data: { otp: string }) => void;
}) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    otp: z.string().min(6, {
      message: ft("Errors.requiredOtp"),
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpClass =
    "shadow-none border-t-0 border-l-0 border-r-0 border-b-2 first:border-l-0 rounded-none first:rounded-l-none last:rounded-r-none data-[active=true]:ring-0";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("TwoFactorPage.twoFactor")}
          </CardTitle>
          <CardDescription className="text-left">
            {t("TwoFactorPage.enterCode")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex justify-center w-full">
                              <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup className="space-x-4">
                                  <InputOTPSlot
                                    index={0}
                                    className={otpClass}
                                  />
                                  <InputOTPSlot
                                    index={1}
                                    className={otpClass}
                                  />
                                  <InputOTPSlot
                                    index={2}
                                    className={otpClass}
                                  />
                                  <InputOTPSlot
                                    index={3}
                                    className={otpClass}
                                  />
                                  <InputOTPSlot
                                    index={4}
                                    className={otpClass}
                                  />
                                  <InputOTPSlot
                                    index={5}
                                    className={otpClass}
                                  />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t("TwoFactorPage.verify")}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t("ForgotPasswordPage.backToLogin")}{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4"
                  >
                    {t("signIn")}
                  </Link>
                </div>
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

export default TwoFaForm;
