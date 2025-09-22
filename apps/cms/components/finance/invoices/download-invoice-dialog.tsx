"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Download } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";

interface DownloadInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string | null;
}

export default function DownloadInvoiceDialog({
  open,
  onOpenChange,
  invoiceNumber,
}: DownloadInvoiceDialogProps) {
  const it = useTranslations("Finance.Invoices");

  const handleDownload = () => {
    if (invoiceNumber) {
      toast.success(it("downloadSuccess", { invoiceNumber }));
      onOpenChange(false);
      // TODO: Implement actual PDF download functionality
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{it("downloadTitle")}</DialogTitle>
        </DialogHeader>
        <p>{invoiceNumber && it("downloadDescription", { invoiceNumber })}</p>
        <DialogFooter>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            {it("downloadPdf")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
