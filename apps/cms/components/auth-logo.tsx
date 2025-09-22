"use client";
import { cn } from "@workspace/ui/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

function AuthLogo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
      )}
    >
      {theme === "dark" ? (
        <Image
          src="/logo-dark.svg"
          alt="Logo"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      ) : (
        <Image
          src="/logo.svg"
          alt="Logo"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      )}
    </div>
  );
}

export default AuthLogo;
