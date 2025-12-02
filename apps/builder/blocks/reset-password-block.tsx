"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "@workspace/ui/react-hook-form";
import { zodResolver } from "@workspace/ui/hookform";
import * as z from "@workspace/ui/zod";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { PasswordInput } from "@workspace/ui/components/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft, Lock, CheckCircle2 } from "@workspace/ui/lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordBlockProps {
  logoSrc?: string;
}

export function ResetPasswordBlock({
  logoSrc = "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
}: ResetPasswordBlockProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    // Handle reset password logic here
    console.log("Reset password:", data);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        {logoSrc && (
          <div className="flex justify-center">
            <Image
              src={logoSrc}
              alt="Logo"
              width={200}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Reset Password Card */}
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                {isSuccess ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Lock className="h-6 w-6 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSuccess ? "Password reset!" : "Set new password"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? "Your password has been successfully reset. You can now sign in with your new password."
                : "Your new password must be different from previously used passwords."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Password Strength Indicators */}
                {password.length > 0 && (
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground font-medium">
                      Password must contain:
                    </p>
                    <ul className="space-y-1">
                      <li
                        key="min-length"
                        className={`flex items-center gap-2 ${hasMinLength ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${hasMinLength ? "text-green-500" : "text-muted-foreground/50"}`}
                        />
                        At least 8 characters
                      </li>
                      <li
                        key="uppercase"
                        className={`flex items-center gap-2 ${hasUppercase ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${hasUppercase ? "text-green-500" : "text-muted-foreground/50"}`}
                        />
                        One uppercase letter
                      </li>
                      <li
                        key="lowercase"
                        className={`flex items-center gap-2 ${hasLowercase ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${hasLowercase ? "text-green-500" : "text-muted-foreground/50"}`}
                        />
                        One lowercase letter
                      </li>
                      <li
                        key="number"
                        className={`flex items-center gap-2 ${hasNumber ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${hasNumber ? "text-green-500" : "text-muted-foreground/50"}`}
                        />
                        One number
                      </li>
                    </ul>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="••••••••"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>

                {/* Back to Login */}
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </form>
            ) : (
              <div className="space-y-4">
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Continue to login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Links */}
        <p className="text-center text-xs text-muted-foreground">
          Having trouble?{" "}
          <Link href="/contact" className="underline hover:text-primary">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}

