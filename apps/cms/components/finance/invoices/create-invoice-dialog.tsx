"use client";
import { useState } from "react";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { PlusIcon, CalendarIcon } from "@workspace/ui/lucide-react";
import { format } from "@workspace/ui/lib/date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { Textarea } from "@workspace/ui/components/textarea";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import ItemTable, { type ItemRow } from "./item-table";
import { Card, CardContent } from "@workspace/ui/components/card";

// Import data
import currencies from "@/data/currencies.json";

// Base schema structure for TypeScript types
type CreateInvoiceFormValues = {
  customerName: string;
  currency: string;
  location: string;
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: Date;
  terms: string;
  dueDate: Date;
  accountReceivable: string;
  subject: string;
  notes?: string;
  bankDetails: string;
  tnc?: string;
};

// Dummy data
const locations = [
  { label: "Location 1", value: "location1" },
  { label: "Location 2", value: "location2" },
  { label: "Location 3", value: "location3" },
  { label: "Location 4", value: "location4" },
];

const terms = [
  { label: "Term 1", value: "term1" },
  { label: "Term 2", value: "term2" },
  { label: "Term 3", value: "term3" },
  { label: "Term 4", value: "term4" },
];

const accountReceivables = [
  { label: "Account 1", value: "account1" },
  { label: "Account 2", value: "account2" },
  { label: "Account 3", value: "account3" },
  { label: "Account 4", value: "account4" },
];

const bankDetails = [
  {
    label: "Bank 1",
    value: "bank1",
    details: {
      accountName: "Bank 1 Account Name",
      bank: "Bank 1",
      accountNumber: "1234567890",
      sortCode: "1234567890",
      iban: "1234567890",
      swiftCode: "1234567890",
    },
  },
  {
    label: "Bank 2",
    value: "bank2",
    details: {
      accountName: "Bank 2 Account Name",
      bank: "Bank 2",
      accountNumber: "1234567890",
      sortCode: "1234567890",
      iban: "1234567890",
      swiftCode: "1234567890",
    },
  },
  {
    label: "Bank 3",
    value: "bank3",
    details: {
      accountName: "Bank 3 Account Name",
      bank: "Bank 3",
      accountNumber: "1234567890",
      sortCode: "1234567890",
      iban: "1234567890",
      swiftCode: "1234567890",
    },
  },
];

export default function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ItemRow[]>([
    {
      id: "1",
      product: null,
      quantity: 1,
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0,
    },
  ]);
  const [adjustment, setAdjustment] = useState(0);
  const t = useTranslations("Finance.Invoices");

  // Create schema with translated error messages
  const createInvoiceSchema = z.object({
    customerName: z
      .string()
      .min(1, { message: t("validation.customerNameRequired") }),
    currency: z.string().min(1, { message: t("validation.currencyRequired") }),
    location: z.string().min(1, { message: t("validation.locationRequired") }),
    invoiceNumber: z
      .string()
      .min(1, { message: t("validation.invoiceNumberRequired") }),
    orderNumber: z
      .string()
      .min(1, { message: t("validation.orderNumberRequired") }),
    invoiceDate: z.date({
      message: t("validation.invoiceDateRequired"),
    }),
    terms: z.string().min(1, { message: t("validation.termsRequired") }),
    dueDate: z.date({ message: t("validation.dueDateRequired") }),
    accountReceivable: z
      .string()
      .min(1, { message: t("validation.accountReceivableRequired") }),
    subject: z.string().min(1, { message: t("validation.subjectRequired") }),
    notes: z.string().optional(),
    bankDetails: z
      .string()
      .min(1, { message: t("validation.bankDetailsRequired") }),
    tnc: z.string().optional(),
  });

  const form = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerName: "",
      currency: "",
      location: "",
      invoiceNumber: "",
      orderNumber: "",
      terms: "",
      accountReceivable: "",
      notes: "",
      bankDetails: bankDetails[0]?.value,
      tnc: "",
    },
  });

  const onSubmit = (values: CreateInvoiceFormValues, isDraft = false) => {
    console.log("Form values:", values);
    console.log("Is draft:", isDraft);

    if (isDraft) {
      toast.success(t("toastDraftSaved"));
    } else {
      toast.success(t("toastSavedAndSent"));
    }

    form.reset();
    setOpen(false);
  };

  const bankDetailsData = bankDetails.find(
    (bank) => bank.value === form.watch("bankDetails")
  )?.details;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("createInvoice")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("newInvoice")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-12 gap-4">
                {/* First Section */}
                <div className="col-span-12">
                  <h3 className="text-lg font-medium mb-4">
                    {t("customerInformation")}
                  </h3>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("customerName")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("customerNamePlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("currency")}</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t("currencyPlaceholder")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem
                                      key={currency.value}
                                      value={currency.value}
                                    >
                                      {currency.label} -{" "}
                                      {currency.currencyFullName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("location")}</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t("locationPlaceholder")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map((location) => (
                                    <SelectItem
                                      key={location.value}
                                      value={location.value}
                                    >
                                      {location.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Second Section */}
                <div className="col-span-12">
                  <h3 className="text-lg font-medium mb-4">
                    {t("invoiceDetails")}
                  </h3>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("invoiceNumber")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("invoiceNumberPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="orderNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("orderNumber")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("orderNumberPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="invoiceDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("invoiceDate")}</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("terms")}</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t("termsPlaceholder")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {terms.map((term) => (
                                    <SelectItem
                                      key={term.value}
                                      value={term.value}
                                    >
                                      {term.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("dueDate")}</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 popover-content-width-same-as-its-trigger"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="accountReceivable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("accountReceivable")}</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t(
                                      "accountReceivablePlaceholder"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {accountReceivables.map((account) => (
                                    <SelectItem
                                      key={account.value}
                                      value={account.value}
                                    >
                                      {account.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("subject")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("subjectPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-12">
                  <ItemTable
                    items={items}
                    onItemsChange={setItems}
                    adjustment={adjustment}
                    onAdjustmentChange={setAdjustment}
                  />
                </div>

                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("notes")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("notesPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="bankDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("bankDetails")}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t("bankDetailsPlaceholder")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {bankDetails.map((bank) => (
                                <SelectItem key={bank.value} value={bank.value}>
                                  {bank.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-12">
                  <Card>
                    <CardContent>
                      <p>
                        {t("accountName")}: {bankDetailsData?.accountName}
                      </p>
                      <p>
                        {t("bank")}: {bankDetailsData?.bank}
                      </p>
                      <p>
                        {t("accountNumber")}: {bankDetailsData?.accountNumber}
                      </p>
                      <p>
                        {t("sortCode")}: {bankDetailsData?.sortCode}
                      </p>
                      <p>
                        {t("iban")}: {bankDetailsData?.iban}
                      </p>
                      <p>
                        {t("swiftCode")}: {bankDetailsData?.swiftCode}
                      </p>
                    </CardContent>
                  </Card>
                  <p className="text-muted-foreground text-sm mt-2">
                    {t("bankDetailsDescription")}
                  </p>
                </div>
                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="tnc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("tnc")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("tncPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
          >
            {t("saveAsDraft")}
          </Button>
          <Button
            onClick={() => form.handleSubmit((data) => onSubmit(data, false))()}
          >
            {t("saveAndSend")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
