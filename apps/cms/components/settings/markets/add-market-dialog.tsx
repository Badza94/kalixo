"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
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
import { toast } from "@workspace/ui/sonner";
import { useTranslations } from "next-intl";
import { Plus } from "@workspace/ui/lucide-react";
import { useState } from "react";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import FilterCountryRender from "@/components/filter-countries-item";

const addMarketSchema = z.object({
  marketType: z.enum(["country", "region"], {
    message: "Market type is required",
  }),
  marketName: z.string().min(2, "Market name must be at least 2 characters"),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  currencyName: z.string().min(1, "Currency name is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  currencyCode: z
    .string()
    .min(3, "Currency code must be at least 3 characters"),
  numberFormat: z.string().min(1, "Number format is required"),
  vatRate: z.number().min(0).max(100, "VAT rate must be between 0 and 100"),
});

type AddMarketFormValues = z.infer<typeof addMarketSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AddMarketDialog({ countries }: { countries: any[] }) {
  const td = useTranslations("Settings.Markets.addMarketDialog");
  const mt = useTranslations("Settings.Markets");
  const [open, setOpen] = useState(false);

  const form = useForm<AddMarketFormValues>({
    resolver: zodResolver(addMarketSchema),
    defaultValues: {
      marketType: undefined,
      marketName: "",
      countries: [],
      currencyName: "",
      currencySymbol: "",
      currencyCode: "",
      numberFormat: "1,234.56",
      vatRate: 0,
    },
  });

  function onSubmit(values: AddMarketFormValues) {
    // TODO: handle submit
    console.log(values);
    toast.success(td("marketCreated"));
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          {td("addMarket")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{td("title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="marketType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("marketType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={td("selectMarketType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="country">
                        {mt("marketTypes.country")}
                      </SelectItem>
                      <SelectItem value="region">
                        {mt("marketTypes.region")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("marketName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={td("marketNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="countries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("countries")}</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={countries}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder={td("selectCountries")}
                      variant="default"
                      maxCount={0}
                      renderItem={(option: { value: string; name: string }) => (
                        <FilterCountryRender
                          countryCode={option.value}
                          label={option.name}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("currencyName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={td("currencyNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currencySymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("currencySymbol")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={td("currencySymbolPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currencyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("currencyCode")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={td("currencyCodePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("numberFormat")}</FormLabel>
                    <Input
                      placeholder={td("numberFormatPlaceholder")}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vatRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("vatRate")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder={td("vatRatePlaceholder")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? td("creating")
                  : td("createMarket")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
