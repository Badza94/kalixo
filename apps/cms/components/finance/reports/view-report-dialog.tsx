"use client";

import { useTranslations } from "next-intl";
import { formatDate } from "@workspace/ui/lib/date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Download } from "@workspace/ui/lucide-react";
import { Report } from "./reports-table";

interface ViewReportDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewReportDialog({
  report,
  open,
  onOpenChange,
}: ViewReportDialogProps) {
  const t = useTranslations("Finance.Reports.viewDialog");

  if (!report) return null;

  const handleDownloadCSV = () => {
    // TODO: Implement CSV download functionality
    console.log("Download CSV for report:", report.id);
  };

  // Format currency values
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode === "USD" ? "USD" : "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate margin percentage
  const calculateMarginPercentage = (margin: number, revenue: number) => {
    if (revenue === 0) return 0;
    return Math.round((margin / revenue) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between mr-4">
            <DialogTitle className="text-2xl font-bold">
              {t("title")} {report.reportNumber}
            </DialogTitle>
            <Button variant="secondary" size="sm" onClick={handleDownloadCSV}>
              <Download className="mr-2 h-4 w-4" />
              {t("downloadCSV")}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Report Details */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{t("reportType")}:</p>
                    <p className="capitalize">{report.type}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t("period")}:</p>
                    <p>{report.period}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t("startDate")}:</p>
                    <p>{formatDate(new Date(report.date), "yyyy-MM-dd")}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t("endDate")}:</p>
                    <p>{formatDate(new Date(report.date), "yyyy-MM-dd")}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t("generatedBy")}:</p>
                    <p>
                      {report.requestedBy.firstName}{" "}
                      {report.requestedBy.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{t("generatedOn")}:</p>
                    <p>{formatDate(new Date(report.date), "yyyy-MM-dd")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="space-y-4 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t("product")}</TableHead>
                    <TableHead>{t("sales")}</TableHead>
                    <TableHead>{t("revenue")}</TableHead>
                    <TableHead>{t("margin")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sales.toLocaleString()}</TableCell>
                      <TableCell>
                        {formatCurrency(product.revenue, product.currencyCode)}
                      </TableCell>
                      <TableCell>
                        {calculateMarginPercentage(
                          product.margin,
                          product.revenue
                        )}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
