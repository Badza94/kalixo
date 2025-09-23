import { Render } from "@measured/puck";
import config from "../puck.config";
import { getPage } from "../lib/get-page";
import { notFound } from "next/navigation";

export default function HomePage() {
  const data = getPage("/");

  if (!data) {
    return notFound();
  }

  return <Render config={config} data={data} />;
}
