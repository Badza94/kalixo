"use client";

import type { Data } from "@measured/puck";
import { Button, Puck } from "@measured/puck";
import config from "../../../puck.config";
import { Eye } from "@workspace/ui/lucide-react";

const overrides = {
  headerActions: ({ children }: { children: React.ReactNode }) => (
    <>
      <Button
        variant="secondary"
        size="medium"
        onClick={() => {
          window.open(`/`, "_blank");
        }}
      >
        <Eye className="h-4 w-4" />
        Preview
      </Button>
      {children}
    </>
  ),
};

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
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
  );
}
