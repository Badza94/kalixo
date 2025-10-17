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
import { PasswordInput } from "@workspace/ui/components/password-input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@workspace/ui/sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    email: z.string().email({ message: ft("Errors.invalidEmail") }),
    password: z.string().min(8, { message: ft("Errors.passwordMinLength") }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "admin@kalixo.io",
      password: "Test123!",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("LOGIN FORM VALUES", values);
    signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: callbackUrl ? decodeURIComponent(callbackUrl) : "/",
      redirect: false,
    })
      .then((res) => {
        console.log("LOGIN FORM RES", res);
        if (res?.error) {
          toast.error(ft("Errors.invalidCredentials"));
        } else if (res?.url) {
          const url = callbackUrl ? decodeURIComponent(callbackUrl) : "/";
          router.push(url);
        }
      })
      .catch(() => {
        toast.error(ft("Errors.somethingWentWrong"));
      });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("LoginPage.welcomeBack")}
          </CardTitle>
          <CardDescription>{t("LoginPage.loginProviders")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  signIn("google", { callbackUrl: callbackUrl ?? `/` })
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 px-2 bg-background text-muted-foreground">
                    {t("continueWith")}
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{ft("email")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="m@example.com"
                              autoComplete="username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>{ft("password")}</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              {t("LoginPage.forgotPassword")}
                            </Link>
                          </div>
                          <FormControl>
                            <PasswordInput placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t("signIn")}
                  </Button>
                </div>
                <div className="text-sm text-center">
                  {t("LoginPage.dontHaveAccount")}
                  <Link
                    href="/register"
                    className="underline underline-offset-4"
                  >
                    {" "}
                    {t("signUp")}
                  </Link>
                </div>
              </form>
            </Form>
          </div>
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
