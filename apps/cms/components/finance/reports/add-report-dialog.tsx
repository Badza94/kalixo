"use client";

import { useState } from "react";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Separator } from "@workspace/ui/components/separator";
import { Plus } from "@workspace/ui/lucide-react";

// Import data
import brands from "@/data/brands.json";
import companies from "@/data/companies.json";
import countries from "@/data/countries.json";
import currencies from "@/data/currencies.json";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

// Define the schema for form validation
const addReportSchema = z.object({
  reportName: z.string().min(1, "reportNameRequired"),
  description: z.string().optional(),
  reportType: z.string().min(1, "reportTypeRequired"),
  frequency: z.string().min(1, "frequencyRequired"),
  brand: z.string().optional(),
  company: z.string().optional(),
  channel: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  productType: z.string().optional(),
  emailNotifications: z.boolean(),
});

type AddReportFormValues = z.infer<typeof addReportSchema>;

export default function AddReportDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Finance.Reports");

  const form = useForm<AddReportFormValues>({
    resolver: zodResolver(addReportSchema),
    defaultValues: {
      reportName: "",
      description: "",
      reportType: "",
      frequency: "",
      brand: "",
      company: "",
      channel: "",
      country: "",
      currency: "",
      productType: "",
      emailNotifications: false,
    },
  });

  const onSubmit = async (values: AddReportFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        t("reportRequestedSuccess", { reportName: values.reportName })
      );
      form.reset();
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Report type options
  const reportTypeOptions = [
    { value: "balance", label: t("reportTypes.balance") },
    { value: "transactions", label: t("reportTypes.transactions") },
    { value: "inventory", label: t("reportTypes.inventory") },
  ];

  // Frequency options
  const frequencyOptions = [
    { value: "daily", label: t("frequencies.daily") },
    { value: "weekly", label: t("frequencies.weekly") },
    { value: "monthly", label: t("frequencies.monthly") },
  ];

  // Channel options
  const channelOptions = [
    { value: "marketplace", label: t("channels.marketplace") },
    { value: "api", label: t("channels.api") },
    { value: "bulk", label: t("channels.bulk") },
    { value: "whitelabel", label: t("channels.whitelabel") },
  ];

  // Product type options
  const productTypeOptions = [
    { value: "game", label: t("productTypes.game") },
    { value: "dlc", label: t("productTypes.dlc") },
    { value: "subscription", label: t("productTypes.subscription") },
  ];

  // Prepare data for selects
  const brandOptions = brands.map((brand) => ({
    value: brand.value,
    label: brand.label,
  }));

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.companyName,
  }));

  const countryOptions = countries.map((country) => ({
    value: country.value,
    label: country.name,
  }));

  const currencyOptions = currencies.map((currency) => ({
    value: currency.value,
    label: `${currency.label} (${currency.symbol})`,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("addReport")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("requestNewReport")}</DialogTitle>
          <DialogDescription>{t("configureReportSettings")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {t("basicInformation")}
                  </h3>
                  <Separator className="mt-2" />
                </div>

                <FormField
                  control={form.control}
                  name="reportName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("reportName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("reportNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("reportDescription")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("reportDescriptionPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 2: Report Configuration */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {t("reportConfiguration")}
                  </h3>
                  <Separator className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("reportType")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t("selectReportType")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("frequency")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectFrequency")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Filters */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{t("filters")}</h3>
                  <Separator className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("brand")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectBrand")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brandOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("company")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectCompany")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companyOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("channel")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectChannel")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {channelOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("country")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectCountry")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countryOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currency")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectCurrency")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencyOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("productType")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t("selectProductType")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 4: Notifications */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{t("notifications")}</h3>
                  <Separator className="mt-2" />
                </div>

                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("emailNotifications")}</FormLabel>
                        <FormDescription>
                          {t("emailNotificationsDescription")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Requesting..." : t("requestReport")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
