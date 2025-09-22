"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
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
import { Button } from "@workspace/ui/components/button";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@workspace/ui/lib/utils";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const formSchema = z.object({
  status: z.enum(["pending", "completed", "failed"]),
});

export type FormValues = z.infer<typeof formSchema>;

export type UpdateStatusDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    type: string;
    amount: number;
    currency: string;
    status: string;
    reference: string;
  };
  onSubmit: (values: FormValues) => void;
};

export function UpdateStatusDialog({
  isOpen,
  onClose,
  activity,
  onSubmit,
}: UpdateStatusDialogProps) {
  const locale = useLocale();
  const t = useTranslations("Finance.Balance");
  const ct = useTranslations("Common");
  const st = useTranslations("Status");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: activity.status as "pending" | "completed" | "failed",
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("updateTransactionStatus")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">{t("transactionDetails")}</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{ct("type")}</span>
                <span>{ct(activity.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{ct("amount")}</span>
                <span>
                  {formatCurrency(activity.amount, activity.currency, locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {ct("currentStatus")}
                </span>
                <span>{st(activity.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{ct("reference")}</span>
                <span>{activity.reference}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ct("newStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={ct("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {st(status.value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("updateStatus")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
