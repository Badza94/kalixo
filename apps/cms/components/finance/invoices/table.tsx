/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useState, useEffect } from "react";
import { cn, formatCurrency } from "@workspace/ui/lib/utils";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Download,
  Send,
} from "@workspace/ui/lucide-react";
import { useLocale, useTranslations } from "next-intl";
import DynamicPagination from "@/components/dynamic-pagination";
import { format } from "@workspace/ui/lib/date-fns";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import ViewInvoiceDialog from "./view-invoice-dialog";
import DownloadInvoiceDialog from "./download-invoice-dialog";
import SendInvoiceDialog from "./send-invoice-dialog";

export interface Invoice {
  id: string;
  invoice_number: string;
  date: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  company: string;
  location: string;
  orderNumber: string;
  terms: string;
  accountReceivable: string;
  subject: string;
  notes?: string;
  bankDetails: string;
  tnc?: string;
  channel: string;
  qty: number;
  amount: number;
  adjustment: number;
  subTotal: number;
  total: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  sent: boolean;
  items: {
    id: number;
    productId: string;
    name: string;
    ean: string;
    brand: string;
    type: string;
    category: string;
    commission: string;
    status: string;
    lastUpdate?: string;
    countryCode: string;
    currencyCode: string;
    price: string;
    priceEUR: number;
    image: string;
    qty: number;
    rate: number;
    discount: number;
    tax: number;
    amount: number;
  }[];
}

export const getInvoiceStatusBadge = (status: string, t: any) => {
  switch (status) {
    case "paid":
      return <Badge variant="success">{t("paid")}</Badge>;
    case "pending":
      return <Badge variant="warning">{t("pending")}</Badge>;
    case "overdue":
      return <Badge variant="destructive">{t("overdue")}</Badge>;
    case "cancelled":
      return <Badge variant="outline">{t("cancelled")}</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

function InvoicesTable({
  invoices,
  initialSort,
  initialLimit,
  initialPage,
  totalPages,
}: {
  invoices: Invoice[];
  initialSort: string;
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}) {
  const [sort, setSort] = useState(initialSort);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [downloadInvoiceNumber, setDownloadInvoiceNumber] = useState<
    string | null
  >(null);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [sendInvoiceNumber, setSendInvoiceNumber] = useState<string | null>(
    null
  );

  const st = useTranslations("Sort");
  const it = useTranslations("Finance.Invoices");
  const ct = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();

  const handleViewInvoice = (invoiceNumber: string) => {
    const invoice = invoices.find(
      (inv) => inv.invoice_number === invoiceNumber
    );
    if (invoice) {
      setSelectedInvoice(invoice);
      setIsViewDialogOpen(true);
    }
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    setDownloadInvoiceNumber(invoiceNumber);
    setIsDownloadDialogOpen(true);
  };

  const handleSendInvoice = (invoiceNumber: string) => {
    setSendInvoiceNumber(invoiceNumber);
    setIsSendDialogOpen(true);
  };

  useEffect(() => {
    // Get current search params to preserve filters from Filters component
    const currentParams = new URLSearchParams(window.location.search);

    // Update only the parameters this component controls
    if (sort && sort !== "newest") {
      currentParams.set("sort", sort);
    } else {
      currentParams.delete("sort");
    }

    if (sort) {
      router.push(`/finance/invoices?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [router, sort]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className={cn("w-[180px] justify-between")}>
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 opacity-70" />
                <SelectValue placeholder={ct("sortBy")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{st("newest")}</SelectItem>
              <SelectItem value="oldest">{st("oldest")}</SelectItem>
              <SelectItem value="amount_asc">
                {st("amount_low_to_high")}
              </SelectItem>
              <SelectItem value="amount_desc">
                {st("amount_high_to_low")}
              </SelectItem>
              <SelectItem value="company_asc">{st("company_az")}</SelectItem>
              <SelectItem value="company_desc">{st("company_za")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[515px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>{it("invoiceNumber")}</TableHead>
                <TableHead>{it("date")}</TableHead>
                <TableHead>{it("company")}</TableHead>
                <TableHead>{it("items")}</TableHead>
                <TableHead>{it("amount")}</TableHead>
                <TableHead>{it("status")}</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{invoice.company}</TableCell>
                  <TableCell>{invoice.qty}</TableCell>
                  <TableCell>
                    {formatCurrency(
                      invoice.amount / 100,
                      invoice.currency,
                      locale
                    )}
                  </TableCell>
                  <TableCell>
                    {getInvoiceStatusBadge(invoice.status, it)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleViewInvoice(invoice.invoice_number)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {ct("view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDownloadInvoice(invoice.invoice_number)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {ct("download")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSendInvoice(invoice.invoice_number)
                          }
                        >
                          <Send className="mr-2 h-4 w-4" />
                          {ct("send")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <DynamicPagination
          currentPage={initialPage}
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>

      <ViewInvoiceDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        invoice={selectedInvoice}
      />

      <DownloadInvoiceDialog
        open={isDownloadDialogOpen}
        onOpenChange={setIsDownloadDialogOpen}
        invoiceNumber={downloadInvoiceNumber}
      />

      <SendInvoiceDialog
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        invoiceNumber={sendInvoiceNumber}
      />
    </Card>
  );
}

export default InvoicesTable;
