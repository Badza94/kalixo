"use client";

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
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { format } from "@workspace/ui/lib/date-fns";
import Image from "next/image";
import { Invoice, getInvoiceStatusBadge } from "./table";

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export default function ViewInvoiceDialog({
  open,
  onOpenChange,
  invoice,
}: ViewInvoiceDialogProps) {
  const locale = useLocale();
  const it = useTranslations("Finance.Invoices");

  if (!invoice) return null;

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = invoice.items.reduce(
    (sum, item) => sum + (item.amount * item.tax) / 100,
    0
  );
  const totalAmount = subtotal + totalTax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between mr-4">
            <DialogTitle className="text-2xl font-bold">
              {it("title")} {invoice.invoice_number}
            </DialogTitle>
            {getInvoiceStatusBadge(invoice.status, it)}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 px-4">
            {/* Invoice Header Information */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Gamezcode Limited</h3>
                <p className="text-sm text-muted-foreground">
                  Dublin Dublin D02 XE80
                  <br />
                  Ireland
                  <br />
                  +353858301610
                  <br />
                  michael.kelly@kalixo.io
                  <br />
                  www.kalixo.io
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{it("invoiceNumber")}:</p>
                    <p>{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p className="font-medium">Balance Due:</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        totalAmount / 100,
                        invoice.currency,
                        locale
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{it("invoiceDate")}:</p>
                    <p>{format(new Date(invoice.invoiceDate), "yyyy-MM-dd")}</p>
                  </div>
                  <div>
                    <p className="font-medium">Terms:</p>
                    <p>{invoice.terms}</p>
                  </div>
                  <div>
                    <p className="font-medium">Due Date:</p>
                    <p>{format(new Date(invoice.dueDate), "yyyy-MM-dd")}</p>
                  </div>
                  <div>
                    <p className="font-medium">P.O.#:</p>
                    <p>{invoice.orderNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="space-y-2">
              <h3 className="font-semibold">Bill To</h3>
              <div className="p-3 border rounded-md bg-muted/30">
                <p className="font-medium text-blue-600">{invoice.company}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Subject: {invoice.subject}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <h3 className="font-semibold">{it("items")}</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Item & Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.id}</p>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.type}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.qty}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            item.rate / 100,
                            invoice.currency,
                            locale
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.discount}%
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            item.amount / 100,
                            invoice.currency,
                            locale
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>
                    {formatCurrency(subtotal / 100, invoice.currency, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>
                    {formatCurrency(totalTax / 100, invoice.currency, locale)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      totalAmount / 100,
                      invoice.currency,
                      locale
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {invoice.notes && (
              <div className="space-y-2">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/30">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
