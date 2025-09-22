"use client";
import { useState } from "react";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import * as z from "@workspace/ui/lib/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import { PlusIcon } from "@workspace/ui/lucide-react";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import currencies from "@/data/currencies.json";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

type Currency = {
  label: string;
  value: string;
  symbol: string;
  countryCode: string;
  currencyFullName: string;
};

const formSchema = z.object({
  currency: z.string().min(1, { message: "Please select a currency" }),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCurrencyAccountDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Finance.Balance.AddCurrencyAccountDialog");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currency")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("currencyPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {(currencies as Currency[]).map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <CircleFlag
                                countryCode={currency.countryCode.toLowerCase()}
                                className="w-5 h-5"
                              />
                              <span className="font-medium">
                                {currency.label}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {currency.currencyFullName}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={!form.watch("currency")}>
                {t("button")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
