"use client";

import { Render } from "@measured/puck";
import config from "../puck.config";
import type { Data } from "@measured/puck";

interface ClientRenderProps {
  data: Data;
}

export function ClientRender({ data }: ClientRenderProps) {
  return <Render config={config} data={data} />;
}
