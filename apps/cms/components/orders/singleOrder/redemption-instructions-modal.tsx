"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

interface RedemptionInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructions: string;
}

export function RedemptionInstructionsModal({
  open,
  onOpenChange,
  instructions,
}: RedemptionInstructionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Redemption Instructions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="whitespace-pre-wrap text-sm">
            {instructions || "No redemption instructions available."}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
