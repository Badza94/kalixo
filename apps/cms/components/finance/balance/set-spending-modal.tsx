"use client";

import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { zodResolver } from "@workspace/ui/lib/hookform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "@workspace/ui/sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import currencies from "@/data/currencies.json";
import { cn } from "@workspace/ui/lib/utils";
import { Wallet } from "./balance-carousel";
import { useTranslations } from "next-intl";
const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Enter a valid amount"),
  notify: z.boolean().optional(),
  useAsDefault: z.boolean().optional(),
});

type SetSpendingForm = z.infer<typeof schema>;

interface SetSpendingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  wallet?: Wallet | null;
}

function getCurrencySymbol(currencyCode: string) {
  const found = currencies.find((c) => c.value === currencyCode);
  return found?.symbol || "$";
}

export function SetSpendingModal({
  open,
  onOpenChange,
  currency,
  wallet,
}: SetSpendingModalProps) {
  const t = useTranslations("Finance.Balance.BalanceCarousel");
  const form = useForm<SetSpendingForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: wallet?.limit?.toString() || "",
      notify: false,
      useAsDefault: false,
    },
  });

  const currencySymbol = getCurrencySymbol(currency);

  function onSubmit(data: SetSpendingForm) {
    toast.success("Spending limit set!", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("setSpending", { currency })}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("amount")}</FormLabel>
                  <FormControl className="relative">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        {currencySymbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("amountPlaceholder")}
                        className={cn(
                          "pl-8",
                          currencySymbol.length > 2 && "pl-12"
                        )}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{t("notify")}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="useAsDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {t("useAsDefault")}
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2">
              {t("setLimitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
