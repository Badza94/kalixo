"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

interface TermsConditionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  termsAndConditions: string;
}

export function TermsConditionsModal({
  open,
  onOpenChange,
  termsAndConditions,
}: TermsConditionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Terms & Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="whitespace-pre-wrap text-sm">
            {termsAndConditions || "No terms and conditions available."}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
