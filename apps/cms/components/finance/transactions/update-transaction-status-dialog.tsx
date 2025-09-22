"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "@workspace/ui/sonner";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { formatCurrency } from "@workspace/ui/lib/utils";
import type { Transaction } from "./transactions-table";

const formSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

type FormData = z.infer<typeof formSchema>;

interface UpdateTransactionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export default function UpdateTransactionStatusDialog({
  open,
  onOpenChange,
  transaction,
}: UpdateTransactionStatusDialogProps) {
  const t = useTranslations("Finance.Transactions");
  const st = useTranslations("Status");
  const ft = useTranslations("Forms");
  const locale = useLocale();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: transaction?.status || "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (transaction) {
      toast.success(
        t("statusUpdatedSuccess", {
          transactionId: transaction.orderId,
          status: st(data.status),
        })
      );
      onOpenChange(false);
      form.reset();
      // TODO: Implement actual status update functionality
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">{st("completed")}</Badge>;
      case "pending":
        return <Badge variant="warning">{st("pending")}</Badge>;
      case "failed":
        return <Badge variant="destructive">{st("failed")}</Badge>;
      case "cancelled":
        return <Badge variant="outline">{st("cancelled")}</Badge>;
      default:
        return <Badge variant="default">{st("unknown")}</Badge>;
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("updateTransactionStatus")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t("transactionDetails")}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">{t("transactionNumber")}:</p>
                <p className="text-muted-foreground">{transaction.orderId}</p>
              </div>
              <div>
                <p className="font-medium">{t("amount")}:</p>
                <p className="text-muted-foreground">
                  {formatCurrency(transaction.amount / 100, "EUR", locale)}
                </p>
              </div>
              <div>
                <p className="font-medium">{t("type")}:</p>
                <p className="text-muted-foreground">
                  {transaction.channelType}
                </p>
              </div>
              <div>
                <p className="font-medium">{t("currentStatus")}:</p>
                <div className="mt-1">{getStatusBadge(transaction.status)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newStatus")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            {st("pending")}
                          </SelectItem>
                          <SelectItem value="completed">
                            {st("completed")}
                          </SelectItem>
                          <SelectItem value="failed">{st("failed")}</SelectItem>
                          <SelectItem value="cancelled">
                            {st("cancelled")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  {ft("cancel")}
                </Button>
                <Button type="submit">{t("updateStatus")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
