"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "@workspace/ui/react-hook-form";
import { zodResolver } from "@workspace/ui/hookform";
import * as z from "@workspace/ui/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft, Mail } from "@workspace/ui/lucide-react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordBlockProps {
  logoSrc?: string;
}

export function ForgotPasswordBlock({
  logoSrc = "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
}: ForgotPasswordBlockProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    // Handle forgot password logic here
    console.log("Forgot password:", data);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-background">
      <div className="space-y-8 w-full max-w-md">
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

        {/* Forgot Password Card */}
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSubmitted ? "Check your email" : "Forgot password?"}
            </CardTitle>
            <CardDescription>
              {isSubmitted
                ? `We've sent a password reset link to ${getValues("email")}`
                : "No worries, we'll send you reset instructions."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
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
                  {isLoading ? "Sending..." : "Reset password"}
                </Button>

                {/* Back to Login */}
                <Link
                  href="/login"
                  className="flex gap-2 justify-center items-center text-sm transition-colors text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </form>
            ) : (
              <div className="space-y-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setIsSubmitted(false)}
                >
                  Resend email
                </Button>

                {/* Back to Login */}
                <Link
                  href="/login"
                  className="flex gap-2 justify-center items-center text-sm transition-colors text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Links */}
        <p className="text-xs text-center text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
