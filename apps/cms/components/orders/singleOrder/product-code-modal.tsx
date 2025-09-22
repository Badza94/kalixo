"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Eye, EyeOff, Copy } from "@workspace/ui/lucide-react";
import { toast } from "@workspace/ui/sonner";

interface ProductCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  code: string;
}

export function ProductCodeModal({
  open,
  onOpenChange,
  productName,
  code,
}: ProductCodeModalProps) {
  const [showCode, setShowCode] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Product Code</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-4">
          <Input
            type={showCode ? "text" : "password"}
            value={code}
            disabled
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
