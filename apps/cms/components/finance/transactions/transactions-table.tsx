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
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Edit } from "@workspace/ui/lucide-react";
import DynamicPagination from "@/components/dynamic-pagination";
import UpdateTransactionStatusDialog from "./update-transaction-status-dialog";
import { formatCurrency } from "@workspace/ui/lib/utils";

export interface Transaction {
  id: string;
  orderId: string;
  status: string;
  createdAt: string;
  time: string;
  channel: string;
  channelType: string;
  merchantReference: string;
  productName: string;
  brand: string;
  productType: string;
  ean: string;
  productId: string;
  currency: string;
  amountLocal: number;
  coupon: string;
  discount: number;
  discountType: string;
  discountAmount: number;
  serviceFee: number;
  margin: number;
  buyingPrice: number;
  buyingPriceCurrency: string;
  fx: number;
  amount: number;
  discountAmountEur: number;
  amountCollectedEur: number;
  company: string;
  productStatus: string;
  vendor: string;
  vendorTransactionId: string;
  serial: string;
  invoiceNumber: string;
  paymentStatus: string;
  psp: string;
  pspReference: string;
  pspBatch: string;
  transactionNumber: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  initialPage: number;
  initialLimit: string;
  totalPages: number;
}

export default function TransactionsTable({
  transactions,
  initialPage,
  initialLimit,
  totalPages,
}: TransactionsTableProps) {
  const t = useTranslations("Finance.Transactions");
  const st = useTranslations("Status");
  const locale = useLocale();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const isAllSelected =
    transactions.length > 0 && selectedIds.size === transactions.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">{st("completed")}</Badge>;
      case "pending":
        return <Badge variant="warning">{st("pending")}</Badge>;
      case "failed":
        return <Badge variant="destructive">{st("failed")}</Badge>;
      default:
        return <Badge variant="default">{st("unknown")}</Badge>;
    }
  };

  const handleChangeStatus = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateStatusDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("tableTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("tableDescription")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[515px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="!w-16">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{t("orderId")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("time")}</TableHead>
                <TableHead>{t("channel")}</TableHead>
                <TableHead>{t("channelType")}</TableHead>
                <TableHead>{t("channelReference")}</TableHead>
                <TableHead>{t("productName")}</TableHead>
                <TableHead>{t("brand")}</TableHead>
                <TableHead>{t("productType")}</TableHead>
                <TableHead>{t("ean")}</TableHead>
                <TableHead>{t("productId")}</TableHead>
                <TableHead>{t("currency")}</TableHead>
                <TableHead>{t("amountLocal")}</TableHead>
                <TableHead>{t("coupon")}</TableHead>
                <TableHead>{t("discount")}</TableHead>
                <TableHead>{t("discountType")}</TableHead>
                <TableHead>{t("discountAmount")}</TableHead>
                <TableHead>{t("serviceFee")}</TableHead>
                <TableHead>{t("margin")}</TableHead>
                <TableHead>{t("buyingPrice")}</TableHead>
                <TableHead>{t("buyingPriceCurrency")}</TableHead>
                <TableHead>{t("fx")}</TableHead>
                <TableHead>{t("amountEur")}</TableHead>
                <TableHead>{t("discountAmountEur")}</TableHead>
                <TableHead>{t("amountCollectedEur")}</TableHead>
                <TableHead>{t("company")}</TableHead>
                <TableHead>{t("productStatus")}</TableHead>
                <TableHead>{t("vendor")}</TableHead>
                <TableHead>{t("vendorTransactionId")}</TableHead>
                <TableHead>{t("serial")}</TableHead>
                <TableHead>{t("invoiceNumber")}</TableHead>
                <TableHead>{t("paymentStatus")}</TableHead>
                <TableHead>{t("psp")}</TableHead>
                <TableHead>{t("pspReference")}</TableHead>
                <TableHead>{t("pspBatch")}</TableHead>
                <TableHead>{t("transactionId")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={38} className="text-center py-8">
                    {t("noTransactionsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="py-8">
                      <Checkbox
                        checked={selectedIds.has(transaction.id)}
                        onCheckedChange={(checked) =>
                          handleSelectTransaction(
                            transaction.id,
                            checked as boolean
                          )
                        }
                        aria-label={t("selectTransaction", {
                          id: transaction.orderId,
                        })}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.orderId}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{transaction.createdAt ?? "-"}</TableCell>
                    <TableCell>{transaction.time ?? "-"}</TableCell>
                    <TableCell>{transaction.channel ?? "-"}</TableCell>
                    <TableCell>{transaction.channelType ?? "-"}</TableCell>
                    <TableCell>
                      {transaction.merchantReference ?? "-"}
                    </TableCell>
                    <TableCell>{transaction.productName ?? "-"}</TableCell>
                    <TableCell>{transaction.brand ?? "-"}</TableCell>
                    <TableCell>{transaction.productType ?? "-"}</TableCell>
                    <TableCell>{transaction.ean ?? "-"}</TableCell>
                    <TableCell>{transaction.productId ?? "-"}</TableCell>
                    <TableCell>{transaction.currency ?? "-"}</TableCell>
                    <TableCell>
                      {transaction.amountLocal
                        ? formatCurrency(transaction.amountLocal, "EUR", locale)
                        : "-"}
                    </TableCell>
                    <TableCell>{transaction.coupon ?? "-"}</TableCell>
                    <TableCell>{transaction.discount ?? "-"}</TableCell>
                    <TableCell>{transaction.discountType ?? "-"}</TableCell>
                    <TableCell>{transaction.discountAmount ?? "-"}</TableCell>
                    <TableCell>{transaction.serviceFee ?? "-"}</TableCell>
                    <TableCell>{transaction.margin ?? "-"}</TableCell>
                    <TableCell>{transaction.buyingPrice ?? "-"}</TableCell>
                    <TableCell>
                      {transaction.buyingPriceCurrency ?? "-"}
                    </TableCell>
                    <TableCell>{transaction.fx ?? "-"}</TableCell>
                    <TableCell>{transaction.amount ?? "-"}</TableCell>
                    <TableCell>
                      {transaction.discountAmountEur ?? "-"}
                    </TableCell>
                    <TableCell>
                      {transaction.amountCollectedEur ?? "-"}
                    </TableCell>
                    <TableCell>{transaction.company ?? "-"}</TableCell>
                    <TableCell>{transaction.productStatus ?? "-"}</TableCell>
                    <TableCell>{transaction.vendor ?? "-"}</TableCell>
                    <TableCell>
                      {transaction.vendorTransactionId ?? "-"}
                    </TableCell>
                    <TableCell>{transaction.serial ?? "-"}</TableCell>
                    <TableCell>{transaction.invoiceNumber ?? "-"}</TableCell>
                    <TableCell>{transaction.paymentStatus ?? "-"}</TableCell>
                    <TableCell>{transaction.psp ?? "-"}</TableCell>
                    <TableCell>{transaction.pspReference ?? "-"}</TableCell>
                    <TableCell>{transaction.pspBatch ?? "-"}</TableCell>
                    <TableCell>
                      {transaction.transactionNumber ?? "-"}
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
                            onClick={() => handleChangeStatus(transaction)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("changeStatus")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <DynamicPagination
          currentPage={initialPage || 1}
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>

      <UpdateTransactionStatusDialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
        transaction={selectedTransaction}
      />
    </Card>
  );
}
