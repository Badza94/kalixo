"use client";

import { useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/routing";
import PasswordForm from "./register/password-form";

function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("AuthPages");

  function onSubmit(data: { password: string; confirmPassword: string }) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <PasswordForm
        onSubmit={onSubmit}
        btnText={t("ResetPasswordPage.reset")}
        title={t("ResetPasswordPage.resetPassword")}
        description={t("ResetPasswordPage.enterNewPassword")}
      >
        <div className="text-center text-sm">
          {t("ForgotPasswordPage.backToLogin")}{" "}
          <Link href="/register" className="underline underline-offset-4">
            {t("signIn")}
          </Link>
        </div>
      </PasswordForm>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        {t.rich("agreeTo", {
          terms: (chunks) => <Link href="#">{chunks}</Link>,
          privacy: (chunks) => <Link href="#">{chunks}</Link>,
        })}
      </div>
    </div>
  );
}

export default ResetPasswordForm;
