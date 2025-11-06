"use client";

import { User } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";

interface AccountActionProps {
  textColor?: string;
  backgroundColor?: string;
}

export function AccountAction({
  textColor,
  backgroundColor,
}: AccountActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
      }}
    >
      <User className="w-4 h-4" />
    </Button>
  );
}
