"use client";

import { useState } from "react";
import type { Data } from "@measured/puck";
import { Button, Puck } from "@measured/puck";
import config from "../../../puck.config";
import { Eye, Palette } from "@workspace/ui/lucide-react";
import { ThemeEditor } from "./theme-editor";
import { Toaster } from "@workspace/ui/components/sonner";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);

  const overrides = {
    headerActions: ({ children }: { children: React.ReactNode }) => (
      <>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => setIsThemeEditorOpen(true)}
        >
          <Palette className="w-4 h-4" />
          Theme
        </Button>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => {
            window.open(`/`, "_blank");
          }}
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        {children}
      </>
    ),
  };

  return (
    <>
      <Puck
        config={config}
        data={data}
        overrides={overrides}
        onPublish={async (data) => {
          await fetch("/puck/api", {
            method: "post",
            body: JSON.stringify({ data, path }),
          });
        }}
      />
      <ThemeEditor
        isOpen={isThemeEditorOpen}
        onClose={() => setIsThemeEditorOpen(false)}
      />
      <Toaster />
    </>
  );
}
