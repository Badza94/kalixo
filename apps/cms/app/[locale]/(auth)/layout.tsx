import AuthLogo from "@/components/auth-logo";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <AuthLogo />
          Kalixo
        </a>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
