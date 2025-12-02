"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { PasswordInput } from "@workspace/ui/components/password-input";
import { Shield } from "@workspace/ui/lucide-react";
import { toast } from "sonner";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[0-9!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one number or special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SecuritySection() {
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = (data: PasswordFormValues) => {
    // Here you would typically call an API to change the password
    console.log("Password change submitted:", data);
    toast.success("Password changed successfully!");
    passwordForm.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security</h2>
          <p className="mt-2 text-muted-foreground">
            Manage your password and account security settings.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Shield className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure. You&apos;ll need
            to verify your current password first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-6"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your current password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full sm:w-auto">
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
