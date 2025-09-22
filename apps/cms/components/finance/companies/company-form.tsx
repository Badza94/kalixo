/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Link, useRouter } from "@/i18n/routing";
import {
  ChevronLeft,
  DollarSign,
  Package,
  TrendingUp,
  Percent,
  X,
  Plus,
} from "@workspace/ui/lucide-react";
import PageTitle from "@/components/page-title";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import * as z from "@workspace/ui/lib/zod";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { SelectSearch } from "@workspace/ui/components/select-search";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { Badge } from "@workspace/ui/components/badge";
import { format } from "@workspace/ui/lib/date-fns";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { Progress } from "@workspace/ui/components/progress";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { ImageUpload } from "@/components/image-upload";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 1;

function CompanyImageUpload({
  form,
  logo,
  whichImage,
  setLogo,
  setOpenImageUpload,
  setWhichImage,
  isEditing,
}: {
  form: any;
  logo: File[];
  whichImage: "logoLight" | "logoDark" | "iconLight" | "iconDark";
  setLogo: (files: File[]) => void;
  setOpenImageUpload: (open: boolean) => void;
  setWhichImage: (
    image: "logoLight" | "logoDark" | "iconLight" | "iconDark"
  ) => void;
  isEditing: boolean;
}) {
  const t = useTranslations("Common");

  return (
    <FormField
      control={form.control}
      name={whichImage}
      disabled={!isEditing}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            {field.value || logo.length > 0 ? (
              <div className="relative w-full">
                {isEditing && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 left-2 z-10 size-5 rounded-full"
                    onClick={() => {
                      field.onChange("");
                      setLogo([]);
                    }}
                    disabled={!isEditing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <Image
                  src={
                    logo.length > 0 && logo[0]
                      ? URL.createObjectURL(logo[0] as Blob)
                      : field.value
                  }
                  alt={t(whichImage)}
                  width={150}
                  height={150}
                  className="object-contain max-h-[150px] w-full rounded-md border border-border"
                />
              </div>
            ) : (
              <Card
                className="border-dashed border-2 w-full h-[150px]"
                onClick={() => {
                  if (!isEditing) return;
                  setOpenImageUpload(true);
                  setWhichImage(whichImage);
                }}
              >
                <CardContent className="flex flex-col h-full items-center justify-center gap-2">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-sm text-center">
                      {t("addImage")}
                    </p>
                    <p className="text-muted-foreground text-xs text-center">
                      600x600px
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </FormControl>
          <FormLabel className="mx-auto">{t(whichImage)}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CompanyForm({
  id,
  company,
  isEdit,
  countries,
  currencies,
}: {
  id: string;
  company: any;
  isEdit: boolean;
  countries: any[];
  currencies: any[];
}) {
  const [isEditing, setIsEditing] = useState(isEdit);
  const [logoLight, setLogoLight] = useState<File[]>([]);
  const [logoDark, setLogoDark] = useState<File[]>([]);
  const [iconLight, setIconLight] = useState<File[]>([]);
  const [iconDark, setIconDark] = useState<File[]>([]);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [whichImage, setWhichImage] = useState<
    "logoLight" | "logoDark" | "iconLight" | "iconDark"
  >("logoLight");

  const t = useTranslations("Finance.Companies");
  const ct = useTranslations("Common");
  const ft = useTranslations("Forms");
  const st = useTranslations("Status");
  const router = useRouter();
  const locale = useLocale();

  const COMPANY_TYPES = [
    {
      value: "marketing_agency",
      label: "marketingAgency",
    },
    {
      value: "api",
      label: "api",
    },
    {
      value: "reseller",
      label: "reseller",
    },
    {
      value: "other",
      label: "other",
    },
  ];

  const STATUS_OPTIONS = [
    { value: "approved", label: st("approved") },
    { value: "pending", label: st("pending") },
    { value: "rejected", label: st("rejected") },
    { value: "suspended", label: st("suspended") },
    { value: "under_review", label: st("under_review") },
  ];

  const formSchema = z.object({
    companyName: z.string().min(1, { message: t("companyNameRequired") }),
    legalName: z.string().min(1, { message: t("legalNameRequired") }),
    website: z.string().min(1, { message: t("websiteRequired") }),
    address: z.string().min(1, { message: t("addressRequired") }),
    countryCode: z.string().min(1, { message: t("countryRequired") }),
    currency: z.string().min(1, { message: t("currencyRequired") }),
    contactName: z.string().min(1, { message: t("contactNameRequired") }),
    contactEmail: z.string().email({ message: t("contactEmailRequired") }),
    tradingName: z.string().min(1, { message: t("tradingNameRequired") }),
    companyType: z.string().min(1, { message: t("companyTypeRequired") }),
    registrationNumber: z
      .string()
      .min(1, { message: t("registrationNumberRequired") }),
    vatNumber: z.string().min(1, { message: t("vatNumberRequired") }),
    city: z.string().min(1, { message: t("cityRequired") }),
    zip: z.string().min(1, { message: t("zipRequired") }),
    status: z.string().min(1, { message: ft("Errors.requiredStatus") }),
    logoLight: z.string().min(1, { message: "Light logo is required" }),
    logoDark: z.string().min(1, { message: "Dark logo is required" }),
    iconLight: z.string().min(1, { message: "Light icon is required" }),
    iconDark: z.string().min(1, { message: "Dark icon is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: company.companyName,
      legalName: company.legalName,
      website: company.website,
      address: company.address,
      countryCode: company.countryCode,
      currency: company.currency,
      contactName: company.contactName,
      contactEmail: company.contactEmail,
      tradingName: company.tradingName,
      companyType: company.companyType,
      registrationNumber: company.registrationNumber,
      vatNumber: company.vatNumber,
      city: company.city,
      zip: company.zip,
      status: company.status,
      logoLight: company.media.find((media: any) => media.type === "logoLight")
        ?.url,
      logoDark: company.media.find((media: any) => media.type === "logoDark")
        ?.url,
      iconLight: company.media.find((media: any) => media.type === "iconLight")
        ?.url,
      iconDark: company.media.find((media: any) => media.type === "iconDark")
        ?.url,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsEditing(false);
    // Here you would typically send the updated values to your API
    toast.success("Customer information updated successfully!");
  }

  const countriesData = countries.map((country) => ({
    value: country.value,
    label: (
      <div className="flex items-center gap-2">
        <CircleFlag
          className="h-4 w-4"
          countryCode={country.value.toLowerCase()}
        />
        {country.name}
      </div>
    ),
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">{st("approved")}</Badge>;
      case "pending":
        return <Badge variant="warning">{st("pending")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{st("rejected")}</Badge>;
      case "suspended":
        return <Badge variant="warning">{st("suspended")}</Badge>;
      case "under_review":
        return <Badge variant="outline">{st("under_review")}</Badge>;
      default:
        return <Badge variant="default">{st("unknown")}</Badge>;
    }
  };

  const handleImageUpload = (files: File[]) => {
    if (whichImage === "logoLight") {
      setLogoLight(files);
      if (files[0]?.name) {
        form.setValue("logoLight", files[0].name);
      }
    } else if (whichImage === "logoDark") {
      setLogoDark(files);
      if (files[0]?.name) {
        form.setValue("logoDark", files[0].name);
      }
    } else if (whichImage === "iconLight") {
      setIconLight(files);
      if (files[0]?.name) {
        form.setValue("iconLight", files[0].name);
      }
    } else if (whichImage === "iconDark") {
      setIconDark(files);
      if (files[0]?.name) {
        form.setValue("iconDark", files[0].name);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/customers`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <PageTitle title="Test Company" description={`Company ID: ${id}`} />
        </div>
        <div className="flex items-center gap-2 relative">
          {isEditing ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  router.push(`/finance/companies/${id}`);
                }}
                className="transition-all duration-200 ease-in-out"
              >
                {ct("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="transition-all duration-200 ease-in-out"
              >
                {ct("save")}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                setIsEditing(true);
                router.push(`/finance/companies/${id}?edit=true`);
              }}
              className="animate-fade-in transition-all duration-200 ease-in-out"
            >
              {ct("edit")}
            </Button>
          )}
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 h-full"
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="col-span-3 xl:col-span-2 space-y-4">
              <div className="flex flex-col h-full space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("companyName")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("companyNamePlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="legalName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("legalName")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("legalNamePlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="tradingName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("tradingName")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("tradingNamePlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="companyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("companyType")}</FormLabel>
                              <FormControl>
                                <Select
                                  disabled={!isEditing}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue
                                        placeholder={ct("selectStatus")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {COMPANY_TYPES.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        {t(type.label)}
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
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="registrationNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("registrationNumber")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t(
                                    "registrationNumberPlaceholder"
                                  )}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="vatNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("vatNumber")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("vatNumberPlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("address")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("addressPlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("city")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("cityPlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("zip")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("zipPlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="countryCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("country")}</FormLabel>
                              <FormControl>
                                <SelectSearch
                                  data={countriesData}
                                  placeholder={ft("selectCountry")}
                                  nothingFound={ct("nothingFound")}
                                  value={field.value || ""}
                                  setValue={field.onChange}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("currency")}</FormLabel>

                              <SelectSearch
                                data={currencies}
                                placeholder={ft("selectCurrency")}
                                nothingFound={ct("nothingFound")}
                                value={field.value || ""}
                                setValue={field.onChange}
                                disabled={!isEditing}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("website")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder={t("websitePlaceholder")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("companyMedia")}</CardTitle>
                    <CardDescription>
                      {t("companyMediaDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-12 gap-4 xl:gap-10">
                      <div className="col-span-12 md:col-span-6 xl:col-span-3">
                        <CompanyImageUpload
                          form={form}
                          whichImage="logoLight"
                          setLogo={setLogoLight}
                          logo={logoLight}
                          setOpenImageUpload={setOpenImageUpload}
                          setWhichImage={setWhichImage}
                          isEditing={isEditing}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 xl:col-span-3">
                        <CompanyImageUpload
                          form={form}
                          whichImage="logoDark"
                          setLogo={setLogoDark}
                          logo={logoDark}
                          setOpenImageUpload={setOpenImageUpload}
                          setWhichImage={setWhichImage}
                          isEditing={isEditing}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 xl:col-span-3">
                        <CompanyImageUpload
                          form={form}
                          whichImage="iconLight"
                          setLogo={setIconLight}
                          logo={iconLight}
                          setOpenImageUpload={setOpenImageUpload}
                          setWhichImage={setWhichImage}
                          isEditing={isEditing}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 xl:col-span-3">
                        <CompanyImageUpload
                          form={form}
                          whichImage="iconDark"
                          setLogo={setIconDark}
                          logo={iconDark}
                          setOpenImageUpload={setOpenImageUpload}
                          setWhichImage={setWhichImage}
                          isEditing={isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="col-span-3 xl:col-span-1 space-y-4">
              <div className="flex flex-col h-full space-y-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>{ct("status")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={!isEditing}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={ct("selectStatus")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {STATUS_OPTIONS.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>{t("kybStatus")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {ct("status")}
                      </p>
                      <p>{getStatusBadge(company.kybStatus.status)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {ct("lastUpdated")}
                      </p>
                      <p>
                        {format(
                          new Date(company.kybStatus.updatedAt),
                          "MMM d, yyyy"
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>{ct("insights")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-md">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("totalSales")}
                          </p>
                          <p className="font-semibold">
                            {formatCurrency(
                              Number(company.insights.totalSales) / 100,
                              company.currency,
                              locale
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-md">
                          <Package className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {ct("items")}
                          </p>
                          <p className="font-semibold">
                            {company.insights.itemsSold} {ct("products")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-md">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <Tooltip>
                              <TooltipTrigger>
                                <p className="text-sm text-muted-foreground cursor-help">
                                  {ct("margin")}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{ct("marginDescription")}</p>
                              </TooltipContent>
                            </Tooltip>
                            <p className="font-semibold">
                              {formatCurrency(
                                Number(company.insights.margin),
                                company.currency,
                                locale
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-md">
                          <Percent className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="text-sm text-muted-foreground cursor-help">
                                {ct("margin")} %
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{ct("marginPercentageDescription")}</p>
                            </TooltipContent>
                          </Tooltip>
                          <p className="font-semibold">
                            {company.insights.marginPercentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("salesByCountry")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.salesByCountry.map((sales: any) => {
                return (
                  <div className="flex flex-col gap-2" key={sales.countryCode}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CircleFlag
                          className="h-4 w-4"
                          countryCode={sales.countryCode.toLowerCase()}
                        />
                        {sales.countryName}
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground text-right">
                        <p>{sales.percentage}%</p>
                        <p>
                          {formatCurrency(
                            sales.price / 100,
                            company.currency,
                            locale
                          )}
                        </p>
                      </div>
                    </div>
                    <Progress value={sales.percentage} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("salesByBrand")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.salesByBrand.map((sales: any) => {
                return (
                  <div className="flex flex-col gap-2" key={sales.brandId}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={sales.logoUrl}
                          alt={sales.name}
                          className="h-4 w-4 rounded-full"
                          width={16}
                          height={16}
                        />
                        {sales.name}
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground text-right">
                        <p>{sales.percentage}%</p>
                        <p>
                          {formatCurrency(
                            sales.price / 100,
                            company.currency,
                            locale
                          )}
                        </p>
                      </div>
                    </div>
                    <Progress value={sales.percentage} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("salesByProduct")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.salesByProduct.map((sales: any) => {
                return (
                  <div className="flex flex-col gap-2" key={sales.productId}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={sales.image}
                          alt={sales.name}
                          className="h-8 w-8 object-contain"
                          width={32}
                          height={32}
                        />
                        {sales.name}
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground text-right">
                        <p>{sales.percentage}%</p>
                        <p>
                          {formatCurrency(
                            sales.price / 100,
                            company.currency,
                            locale
                          )}
                        </p>
                      </div>
                    </div>
                    <Progress value={sales.percentage} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <ImageUpload
        open={openImageUpload}
        onOpenChange={setOpenImageUpload}
        onUpload={handleImageUpload}
        maxFiles={MAX_FILES}
        maxSize={MAX_SIZE}
      />
    </div>
  );
}

export default CompanyForm;
