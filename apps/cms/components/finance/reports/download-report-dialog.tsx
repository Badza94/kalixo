"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Download } from "@workspace/ui/lucide-react";
import { toast } from "@workspace/ui/sonner";
import { Report } from "./reports-table";

interface DownloadReportDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DownloadReportDialog({
  report,
  open,
  onOpenChange,
}: DownloadReportDialogProps) {
  const t = useTranslations("Finance.Reports.downloadDialog");

  if (!report) return null;

  const handleDownload = () => {
    // TODO: Implement actual CSV download functionality
    console.log("Downloading report:", report.id);

    // Show success toast
    toast.success(t("downloadSuccess"));

    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <p>{t("content", { reportId: report.reportNumber })}</p>

        <DialogFooter>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            {t("downloadCSV")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
