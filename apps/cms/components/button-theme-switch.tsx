"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@workspace/ui/components/button";
import { Moon, Sun } from "@workspace/ui/lucide-react";

export function ButtonThemeSwitch() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] block dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
