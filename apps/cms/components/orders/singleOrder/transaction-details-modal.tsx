"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  transactionId: string;
  serialNumber: string;
  platform: string;
}

export function TransactionDetailsModal({
  open,
  onOpenChange,
  productName,
  transactionId,
  serialNumber,
  platform,
}: TransactionDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Product</div>
            <div>{productName}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Transaction ID</div>
            <div>{transactionId}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Serial Number</div>
            <div>{serialNumber}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-medium">Platform</div>
            <div>{platform}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
