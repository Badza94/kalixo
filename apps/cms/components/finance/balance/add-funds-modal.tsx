"use client";

import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import { zodResolver } from "@workspace/ui/lib/hookform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
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
import { useTranslations } from "next-intl";

const paymentMethods = [
  { value: "bank", label: "Bank Transfer" },
  { value: "card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
];

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
  paymentMethod: z.string().min(1, "Select a payment method"),
  paymentReference: z.string().min(1, "Reference is required").optional(),
});

type AddFundsForm = z.infer<typeof schema>;

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
}

function getCurrencySymbol(currencyCode: string) {
  const found = currencies.find((c) => c.value === currencyCode);
  return found?.symbol || "$";
}

export function AddFundsModal({
  open,
  onOpenChange,
  currency,
}: AddFundsModalProps) {
  const t = useTranslations("Finance.Balance.BalanceCarousel");
  const form = useForm<AddFundsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      paymentMethod: "",
      paymentReference: "",
    },
  });

  const currencySymbol = getCurrencySymbol(currency);

  function onSubmit(data: AddFundsForm) {
    toast.success("Funds request submitted!", {
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
        <div>
          <DialogHeader>
            <DialogTitle>{t("addFunds", { currency })}</DialogTitle>
            <DialogDescription>{t("addFundsDescription")}</DialogDescription>
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paymentMethod")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("paymentMethodPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((pm) => (
                            <SelectItem key={pm.value} value={pm.value}>
                              {pm.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paymentReference")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          t("paymentReference") || "Payment reference"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2">
                {t("addFundsButton")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
