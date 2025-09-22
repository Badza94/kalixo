import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
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
import { PasswordInput } from "@workspace/ui/components/password-input";
import { CheckCircle2, XCircle } from "@workspace/ui/lucide-react";
import { Progress } from "@workspace/ui/components/progress";
import { useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
function PasswordForm({
  onSubmit,
  btnText,
  children,
  title,
  description,
}: {
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
  btnText: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const ft = useTranslations("Forms");

  const [passwordStrength, setPasswordStrength] = useState(0);
  // Define the password requirements
  const passwordRequirements = useMemo(
    () => [
      { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
      { id: "lowercase", label: "Lowercase letters (a-z)", regex: /[a-z]/ },
      { id: "uppercase", label: "Uppercase letters (A-Z)", regex: /[A-Z]/ },
      {
        id: "special",
        label: "Numbers or special characters",
        regex: /[0-9!@#$%^&*(),.?":{}|<>]/,
      },
    ],
    []
  );

  // Create a custom validator for password requirements
  const passwordValidator = (password: string) => {
    return passwordRequirements.every((req) => req.regex.test(password));
  };

  const formSchema = z
    .object({
      password: z
        .string()
        .min(1, "Password is required")
        .refine(passwordValidator, {
          message: "Password must meet all requirements",
        }),
      confirmPassword: z
        .string()
        .min(8, { message: ft("Errors.passwordMinLength") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: ft("Errors.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch the password field to update strength
  const watchPassword = form.watch("password");

  // Check if a requirement is met
  const checkRequirement = (
    requirement: { regex: RegExp },
    password: string
  ) => {
    return requirement.regex.test(password);
  };

  // Update password strength when password changes
  useEffect(() => {
    const metRequirements = passwordRequirements.filter((req) =>
      checkRequirement(req, watchPassword)
    ).length;
    setPasswordStrength((metRequirements / passwordRequirements.length) * 100);
  }, [passwordRequirements, watchPassword]);

  const passwordValueLength = form.getValues("password").length;
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-left">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Password forms should have (optionally hidden) username fields for accessibility: 
            (More info: https://goo.gl/9p2vKq)  
        */}
              <input
                hidden
                name="username"
                autoComplete="username email"
                defaultValue="1"
              />

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ft("password")}</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Password strength</span>
                      <span>
                        {passwordStrength === 100
                          ? "Strong"
                          : passwordStrength >= 50
                            ? "Medium"
                            : "Weak"}
                      </span>
                    </div>

                    <Progress
                      value={passwordStrength}
                      indicatorClassName={
                        passwordStrength === 100
                          ? "bg-green-500"
                          : passwordStrength >= 50
                            ? "bg-yellow-500"
                            : passwordValueLength > 0
                              ? "bg-red-500"
                              : "transparent"
                      }
                    />
                  </div>

                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => {
                      const isMet = checkRequirement(req, watchPassword);
                      return (
                        <li key={req.id} className="flex items-center text-sm">
                          {isMet ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle
                              className={cn(
                                "mr-2 h-4 w-4",
                                passwordValueLength > 0
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              "text-muted-foreground",
                              isMet && passwordValueLength > 0
                                ? "text-green-700"
                                : passwordValueLength > 0
                                  ? "text-red-700"
                                  : ""
                            )}
                          >
                            {req.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ft("confirmPassword")}</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {btnText}
                </Button>
              </div>
              {children}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PasswordForm;
