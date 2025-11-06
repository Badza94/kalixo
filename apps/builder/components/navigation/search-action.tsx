"use client";

import { Search } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";

interface SearchActionProps {
  onClick: () => void;
  textColor?: string;
  backgroundColor?: string;
}

export function SearchAction({
  onClick,
  textColor,
  backgroundColor,
}: SearchActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
      }}
    >
      <Search className="w-4 h-4" />
    </Button>
  );
}
