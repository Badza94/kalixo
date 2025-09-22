import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="flex w-full h-[calc(100vh-85px)] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
