import { getPage } from "../lib/get-page";
import { notFound } from "next/navigation";
import { ClientRender } from "./client-render";

export default function HomePage() {
  const data = getPage("/");

  if (!data) {
    return notFound();
  }

  return <ClientRender data={data} />;
}
