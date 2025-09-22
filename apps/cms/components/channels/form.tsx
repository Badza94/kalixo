/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageTitle from "@/components/page-title";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "@workspace/ui/lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import countriesData from "@/data/countries.json";
import currenciesData from "@/data/currencies.json";
import { supportedLocalesJson } from "@/data/supportedLocales";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { formatDate } from "@workspace/ui/lib/date-fns";
import { ImageUpload } from "@/components/image-upload";
import {
  Upload,
  Check,
  AlertTriangle,
  DollarSign,
  Package,
  TrendingUp,
  Percent,
  Users,
  Plus,
  X,
  Globe,
  Tag,
  Box,
  Building,
} from "@workspace/ui/lucide-react";
import { useState } from "react";
import { Timeline, TimelineEntry } from "@workspace/ui/components/timeline";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import Notes from "../notes";
// import { User } from "@workspace/ui/lib/next-auth";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

const ChannelForm = ({
  id,
  edit,
  channel,
  timelineData,
  notes,
  currentUser,
}: {
  id: string;
  edit: boolean;
  channel: any;
  timelineData: TimelineEntry[];
  notes: any[];
  currentUser: any;
}) => {
  const t = useTranslations("Channels");
  const ct = useTranslations("Common");

  // Upload dialog states
  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const [iconUploadOpen, setIconUploadOpen] = useState(false);
  const [faviconUploadOpen, setFaviconUploadOpen] = useState(false);
  const [logoDarkUploadOpen, setLogoDarkUploadOpen] = useState(false);
  const [iconDarkUploadOpen, setIconDarkUploadOpen] = useState(false);
  const [faviconDarkUploadOpen, setFaviconDarkUploadOpen] = useState(false);

  // Catalogue configuration state
  const [selectedCountries, setSelectedCountries] = useState(["North America"]);
  const [selectedBrands, setSelectedBrands] = useState(["PlayStation"]);
  const [selectedProductTypes, setSelectedProductTypes] = useState([
    "Game Bundle",
  ]);
  const [selectedVendors, setSelectedVendors] = useState([
    "InComm",
    "LikeCard",
    "ePay",
  ]);
  const [exceptionConditions, setExceptionConditions] = useState([
    { id: 1, field: "", operator: "equals", value: "" },
  ]);
  const [conditionOperators, setConditionOperators] = useState<string[]>([]); // Operators between conditions

  // Available options for multi-select dropdowns
  const availableCountries = [
    { label: "North America", value: "North America" },
    { label: "Europe", value: "Europe" },
    { label: "Asia Pacific", value: "Asia Pacific" },
    { label: "Latin America", value: "Latin America" },
    { label: "Middle East & Africa", value: "Middle East & Africa" },
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Germany", value: "Germany" },
    { label: "France", value: "France" },
    { label: "Italy", value: "Italy" },
    { label: "Spain", value: "Spain" },
    { label: "Japan", value: "Japan" },
    { label: "Australia", value: "Australia" },
  ];

  const availableBrands = [
    { label: "PlayStation", value: "PlayStation" },
    { label: "Xbox", value: "Xbox" },
    { label: "Nintendo", value: "Nintendo" },
    { label: "Steam", value: "Steam" },
    { label: "Apple", value: "Apple" },
    { label: "Google Play", value: "Google Play" },
    { label: "Amazon", value: "Amazon" },
    { label: "Netflix", value: "Netflix" },
    { label: "Spotify", value: "Spotify" },
    { label: "Visa", value: "Visa" },
    { label: "Mastercard", value: "Mastercard" },
    { label: "PayPal", value: "PayPal" },
  ];

  const availableProductTypes = [
    { label: "Game Bundle", value: "Game Bundle" },
    { label: "Digital Game", value: "Digital Game" },
    { label: "Gift Card", value: "Gift Card" },
    { label: "Subscription", value: "Subscription" },
    { label: "In-Game Currency", value: "In-Game Currency" },
    { label: "DLC Content", value: "DLC Content" },
    { label: "Software License", value: "Software License" },
    { label: "Music Streaming", value: "Music Streaming" },
    { label: "Video Streaming", value: "Video Streaming" },
    { label: "Mobile Credit", value: "Mobile Credit" },
    { label: "Prepaid Card", value: "Prepaid Card" },
  ];

  const availableVendors = [
    { label: "InComm", value: "InComm" },
    { label: "LikeCard", value: "LikeCard" },
    { label: "ePay", value: "ePay" },
    { label: "Blackhawk Network", value: "Blackhawk Network" },
    { label: "Cashstar", value: "Cashstar" },
    { label: "Stored Value Solutions", value: "Stored Value Solutions" },
    { label: "First Data", value: "First Data" },
    { label: "Givex", value: "Givex" },
    { label: "ValueLink", value: "ValueLink" },
    { label: "EuroNet", value: "EuroNet" },
    { label: "Worldpay", value: "Worldpay" },
  ];

  // Upload handlers
  const handleLogoUpload = (files: File[]) => {
    if (files.length > 0) {
      // Handle logo upload logic here
      console.log("Logo uploaded:", files[0]);
    }
    setLogoUploadOpen(false);
  };

  const handleIconUpload = (files: File[]) => {
    if (files.length > 0) {
      // Handle icon upload logic here
      console.log("Icon uploaded:", files[0]);
    }
    setIconUploadOpen(false);
  };

  const handleFaviconUpload = (files: File[]) => {
    if (files.length > 0) {
      // Handle favicon upload logic here
      console.log("Favicon uploaded:", files[0]);
    }
    setFaviconUploadOpen(false);
  };

  const handleLogoDarkUpload = (files: File[]) => {
    if (files.length > 0) {
      // Handle dark logo upload logic here
      console.log("Dark logo uploaded:", files[0]);
    }
    setLogoDarkUploadOpen(false);
  };

  const handleIconDarkUpload = (files: File[]) => {
    if (files.length > 0) {
      // Handle dark icon upload logic here
      console.log("Dark icon uploaded:", files[0]);
    }
    setIconDarkUploadOpen(false);
  };

  const handleFaviconDarkUpload = (files: File[]) => {
    if (files.length > 0) {
      // Handle dark favicon upload logic here
      console.log("Dark favicon uploaded:", files[0]);
    }
    setFaviconDarkUploadOpen(false);
  };

  const formSchema = z
    .object({
      channelName: z.string().min(1, { message: "Channel name is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      domainType: z.enum(["default", "custom"]),
      customDomain: z.string().optional(),
      defaultLocation: z
        .string()
        .min(1, { message: "Default location is required" }),
      defaultCurrency: z
        .string()
        .min(1, { message: "Default currency is required" }),
      defaultLanguage: z
        .string()
        .min(1, { message: "Default language is required" }),
    })
    .refine(
      (data) => {
        if (
          data.domainType === "custom" &&
          (!data.customDomain || data.customDomain.trim() === "")
        ) {
          return false;
        }
        return true;
      },
      {
        message:
          "Custom domain is required when custom domain type is selected",
        path: ["customDomain"],
      }
    );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: channel?.name || "",
      description: channel?.description || "",
      domainType: channel?.domainType || "default",
      customDomain: channel?.customDomain || "",
      defaultLocation: channel?.defaultLocation || "",
      defaultCurrency: channel?.defaultCurrency || "",
      defaultLanguage: channel?.defaultLanguage || "",
    },
  });

  const watchDomainType = form.watch("domainType");

  function onSubmit(values: FormValues) {
    console.log(values);
    // Here you would typically send the updated values to your API
  }

  const generateDefaultDomain = (channelId: string) => {
    return `preview-${channelId}-app.kalixo.com`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    ];
    return colors[index % colors.length];
  };

  // Catalogue helper functions
  const removeFilter = (category: string, item: string) => {
    switch (category) {
      case "countries":
        setSelectedCountries((prev) => prev.filter((c) => c !== item));
        break;
      case "brands":
        setSelectedBrands((prev) => prev.filter((b) => b !== item));
        break;
      case "productTypes":
        setSelectedProductTypes((prev) => prev.filter((p) => p !== item));
        break;
      case "vendors":
        setSelectedVendors((prev) => prev.filter((v) => v !== item));
        break;
    }
  };

  const addExceptionCondition = () => {
    const newId = Math.max(...exceptionConditions.map((c) => c.id)) + 1;
    setExceptionConditions((prev) => [
      ...prev,
      { id: newId, field: "", operator: "equals", value: "" },
    ]);
    // Add a new operator for the new condition (default to AND)
    setConditionOperators((prev) => [...prev, "AND"]);
  };

  const removeExceptionCondition = (id: number) => {
    const index = exceptionConditions.findIndex((c) => c.id === id);
    setExceptionConditions((prev) => prev.filter((c) => c.id !== id));
    // Remove the corresponding operator (remove the one after this condition, or before if it's the last)
    if (index > 0) {
      setConditionOperators((prev) => prev.filter((_, i) => i !== index - 1));
    } else if (conditionOperators.length > 1) {
      setConditionOperators((prev) => prev.filter((_, i) => i !== 0));
    }
  };

  const updateExceptionCondition = (
    id: number,
    field: string,
    value: string
  ) => {
    setExceptionConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const toggleConditionOperator = (index: number) => {
    setConditionOperators((prev) =>
      prev.map((op, i) => (i === index ? (op === "AND" ? "OR" : "AND") : op))
    );
  };

  const generateExceptionQuery = () => {
    const validConditions = exceptionConditions.filter(
      (c) => c.field && c.value
    );
    if (validConditions.length === 0) return "EXCLUDE WHERE = ''";

    let query = "EXCLUDE WHERE ";
    validConditions.forEach((condition, index) => {
      query += `${condition.field} ${condition.operator} '${condition.value}'`;
      if (index < validConditions.length - 1 && conditionOperators[index]) {
        query += ` ${conditionOperators[index]} `;
      }
    });

    return query;
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/channels">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <PageTitle
            title="Test Channel"
            description={`${t("channelId")}: ${id}`}
          />
        </div>
        <div>
          {edit ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/channels/${id}`}
                className={buttonVariants({ variant: "secondary" })}
              >
                {ct("cancel")}
              </Link>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="transition-all duration-200 ease-in-out"
              >
                {ct("save")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={`/channels/${id}?edit=true`}
                className={buttonVariants({ variant: "outline" })}
              >
                {ct("edit")}
              </Link>
              <Button>{ct("customize")} </Button>
            </div>
          )}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("channelInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Channel Name */}
                  <FormField
                    control={form.control}
                    name="channelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channel Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter channel name"
                            {...field}
                            disabled={!edit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter channel description"
                            className="min-h-[100px]"
                            {...field}
                            disabled={!edit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Channel URL */}
                  <FormField
                    control={form.control}
                    name="domainType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Channel URL</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center gap-4"
                            disabled={!edit}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="default" id="default" />
                              <Label htmlFor="default">Default Domain</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom" />
                              <Label htmlFor="custom">Custom Domain</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Domain Input */}
                  {watchDomainType === "default" && (
                    <div className="space-y-2">
                      <Label>Preview URL</Label>
                      <Input
                        value={generateDefaultDomain(id)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  )}

                  {watchDomainType === "custom" && (
                    <FormField
                      control={form.control}
                      name="customDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Domain</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter custom domain"
                              {...field}
                              disabled={!edit}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    {/* Default Location */}
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="defaultLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Location</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!edit}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select default location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countriesData.map((country) => (
                                  <SelectItem
                                    key={country.value}
                                    value={country.value}
                                  >
                                    <div className="flex items-center">
                                      <CircleFlag
                                        countryCode={country.value.toLowerCase()}
                                        className="mr-2 w-4 h-4"
                                      />
                                      {country.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Default Currency */}
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="defaultCurrency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!edit}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select default currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currenciesData.map((currency) => (
                                  <SelectItem
                                    key={currency.value}
                                    value={currency.value}
                                  >
                                    {currency.label} ({currency.symbol}) -{" "}
                                    {currency.currencyFullName}
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

                  {/* Default Language */}
                  <FormField
                    control={form.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!edit}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select default language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supportedLocalesJson.map((language) => (
                              <SelectItem
                                key={language.locale}
                                value={language.locale}
                              >
                                {language.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Non-editable fields */}
                  <div className="space-y-4 pt-4 border-t">
                    {/* Company */}
                    <div className="space-y-2">
                      <Label>{ct("company")}</Label>
                      <Input
                        value={channel?.companyName}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      {/* Created At */}
                      <div className="space-y-2 w-full">
                        <Label>{ct("createdAt")}</Label>
                        <Input
                          value={formatDate(
                            channel?.createdAt || "",
                            "yyyy-MM-dd"
                          )}
                          disabled
                          className="bg-muted w-full "
                        />
                      </div>

                      {/* Updated At */}
                      <div className="space-y-2 w-full">
                        <Label>{ct("updatedAt")}</Label>
                        <Input
                          value={formatDate(
                            channel?.updatedAt || "",
                            "yyyy-MM-dd"
                          )}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("channelImages")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Light Theme Images */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Light Theme</h4>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {/* Logo Upload */}
                        <div className="space-y-2">
                          <Label>Logo</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                            onClick={() => setLogoUploadOpen(true)}
                            disabled={!edit}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">
                              {channel?.logoUrl ? "Update Logo" : "Upload Logo"}
                            </span>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 200x60px, PNG or SVG
                          </p>
                        </div>

                        {/* Icon Upload */}
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                            onClick={() => setIconUploadOpen(true)}
                            disabled={!edit}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">
                              {channel?.iconUrl ? "Update Icon" : "Upload Icon"}
                            </span>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 64x64px, PNG or ICO
                          </p>
                        </div>

                        {/* Favicon Upload */}
                        <div className="space-y-2">
                          <Label>Favicon</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                            onClick={() => setFaviconUploadOpen(true)}
                            disabled={!edit}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">
                              {channel?.faviconUrl
                                ? "Update Favicon"
                                : "Upload Favicon"}
                            </span>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 32x32px, ICO or PNG
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dark Theme Images */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Dark Theme</h4>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {/* Dark Logo Upload */}
                        <div className="space-y-2">
                          <Label>Logo (Dark)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                            onClick={() => setLogoDarkUploadOpen(true)}
                            disabled={!edit}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">
                              {channel?.logoDarkUrl
                                ? "Update Dark Logo"
                                : "Upload Dark Logo"}
                            </span>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 200x60px, PNG or SVG
                          </p>
                        </div>

                        {/* Dark Icon Upload */}
                        <div className="space-y-2">
                          <Label>Icon (Dark)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                            onClick={() => setIconDarkUploadOpen(true)}
                            disabled={!edit}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">
                              {channel?.iconDarkUrl
                                ? "Update Dark Icon"
                                : "Upload Dark Icon"}
                            </span>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 64x64px, PNG or ICO
                          </p>
                        </div>

                        {/* Dark Favicon Upload */}
                        <div className="space-y-2">
                          <Label>Favicon (Dark)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                            onClick={() => setFaviconDarkUploadOpen(true)}
                            disabled={!edit}
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">
                              {channel?.faviconDarkUrl
                                ? "Update Dark Favicon"
                                : "Upload Dark Favicon"}
                            </span>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 32x32px, ICO or PNG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Channel Catalogue Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {t("catalogue.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("catalogue.description")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Filter Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Countries */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <Label className="font-medium">
                            {t("catalogue.countries")}
                          </Label>
                        </div>
                      </div>
                      {edit && (
                        <div className="mb-3">
                          <MultiSelect
                            options={availableCountries}
                            onValueChange={setSelectedCountries}
                            defaultValue={selectedCountries}
                            placeholder="Select countries..."
                            variant="inverted"
                            maxCount={0}
                            className="w-full"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {selectedCountries.map((country) => (
                          <Badge
                            key={country}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            🌍 {country}
                            {edit && (
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() =>
                                  removeFilter("countries", country)
                                }
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Brands */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-600" />
                          <Label className="font-medium">
                            {t("catalogue.brands")}
                          </Label>
                        </div>
                      </div>
                      {edit && (
                        <div className="mb-3">
                          <MultiSelect
                            options={availableBrands}
                            onValueChange={setSelectedBrands}
                            defaultValue={selectedBrands}
                            placeholder="Select brands..."
                            variant="inverted"
                            maxCount={0}
                            className="w-full"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {selectedBrands.map((brand) => (
                          <Badge
                            key={brand}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {brand}
                            {edit && (
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeFilter("brands", brand)}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Product Types */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-purple-600" />
                          <Label className="font-medium">
                            {t("catalogue.productTypes")}
                          </Label>
                        </div>
                      </div>
                      {edit && (
                        <div className="mb-3">
                          <MultiSelect
                            options={availableProductTypes}
                            onValueChange={setSelectedProductTypes}
                            defaultValue={selectedProductTypes}
                            placeholder="Select product types..."
                            variant="inverted"
                            maxCount={0}
                            className="w-full"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {selectedProductTypes.map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {type}
                            {edit && (
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() =>
                                  removeFilter("productTypes", type)
                                }
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Vendors */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-orange-600" />
                          <Label className="font-medium">
                            {t("catalogue.vendors")}
                          </Label>
                        </div>
                      </div>
                      {edit && (
                        <div className="mb-3">
                          <MultiSelect
                            options={availableVendors}
                            onValueChange={setSelectedVendors}
                            defaultValue={selectedVendors}
                            placeholder="Select vendors..."
                            variant="inverted"
                            maxCount={0}
                            className="w-full"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {selectedVendors.map((vendor) => (
                          <Badge
                            key={vendor}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {vendor}
                            {edit && (
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeFilter("vendors", vendor)}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Exceptions Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        {t("catalogue.exceptions.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("catalogue.exceptions.description")}
                      </p>
                    </div>

                    {/* Exception Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">
                          {t("catalogue.exceptions.conditionsTitle")}
                        </h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addExceptionCondition}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t("catalogue.exceptions.addCondition")}
                        </Button>
                      </div>

                      {/* Condition Builder */}
                      <div className="space-y-3">
                        {exceptionConditions.map((condition, index) => (
                          <div key={condition.id}>
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                              <span className="text-sm font-mono text-muted-foreground min-w-0">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                {t("catalogue.exceptions.exclude")}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {t("catalogue.exceptions.where")}
                              </span>
                              <Select
                                value={condition.field}
                                onValueChange={(value) =>
                                  updateExceptionCondition(
                                    condition.id,
                                    "field",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue
                                    placeholder={t(
                                      "catalogue.exceptions.selectField"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="brand">Brand</SelectItem>
                                  <SelectItem value="category">
                                    Category
                                  </SelectItem>
                                  <SelectItem value="vendor">Vendor</SelectItem>
                                  <SelectItem value="country">
                                    Country
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
                                value={condition.operator}
                                onValueChange={(value) =>
                                  updateExceptionCondition(
                                    condition.id,
                                    "operator",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue
                                    placeholder={t(
                                      "catalogue.exceptions.equals"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="contains">
                                    Contains
                                  </SelectItem>
                                  <SelectItem value="starts_with">
                                    Starts with
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Value"
                                value={condition.value}
                                onChange={(e) =>
                                  updateExceptionCondition(
                                    condition.id,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              {exceptionConditions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeExceptionCondition(condition.id)
                                  }
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            {/* AND/OR Toggle Button */}
                            {index < exceptionConditions.length - 1 && (
                              <div className="flex justify-center py-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleConditionOperator(index)}
                                  className="min-w-[60px] h-8 text-sm font-medium bg-background border-2 hover:bg-muted/50 transition-colors"
                                >
                                  {conditionOperators[index] || "AND"}
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Generated Query */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t("catalogue.exceptions.generatedQuery")}
                        </Label>
                        <div className="p-3 bg-muted/50 rounded-lg border">
                          <code className="text-sm font-mono text-muted-foreground">
                            {generateExceptionQuery()}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("timeline")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Timeline entries={timelineData} />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4 flex flex-col">
              {/* Status Card */}
              <Card>
                <CardContent>
                  <div className="space-y-6">
                    {/* Status Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {t("status.title")}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {t("status.currentStatus")}
                        </span>
                        {/* <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md dark:bg-yellow-900/30 dark:text-yellow-400">
                          {t(`status.${channel?.status || "draft"}`)}
                        </span> */}
                        <Badge
                          variant={
                            channel?.status === "draft"
                              ? "warning"
                              : channel?.status === "active"
                                ? "success"
                                : "default"
                          }
                        >
                          {t(`status.${channel?.status || "draft"}`)}
                        </Badge>
                      </div>
                    </div>

                    {/* Publishing Checklist */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {t("publishingChecklist.title")}
                      </h3>
                      <div className="space-y-3">
                        {/* Complete theme setup */}
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            {t("publishingChecklist.completeThemeSetup")}
                          </span>
                        </div>

                        {/* Add at least one product */}
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                          <span className="text-sm text-muted-foreground">
                            {t("publishingChecklist.addProduct")}
                          </span>
                        </div>

                        {/* Configure payment methods */}
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                          <span className="text-sm text-muted-foreground">
                            {t("publishingChecklist.configurePayment")}
                          </span>
                        </div>

                        {/* Set up shipping rules */}
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center dark:bg-yellow-900/30">
                            <AlertTriangle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <span className="text-sm text-yellow-700 dark:text-yellow-400">
                            {t("publishingChecklist.setupShipping")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commercials Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("commercials.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {t("commercials.tier")}
                      </span>
                      <p className="font-medium">Tier 1</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {t("commercials.revenueType")}
                      </span>
                      <p className="font-medium">
                        {t("commercials.revenueShare")}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {t("commercials.paymentTerms")}
                      </span>
                      <p className="font-medium">Net 30</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {t("commercials.nextInvoiceDate")}
                      </span>
                      <p className="font-medium">2024-01-15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Insights Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("channelInsights.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sales */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("channelInsights.sales")}
                        </p>
                        <p className="text-lg font-semibold">£847,320.00</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                        <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("channelInsights.items")}
                        </p>
                        <p className="text-lg font-semibold">
                          15,247 {t("channelInsights.products")}
                        </p>
                      </div>
                    </div>

                    {/* Margin */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center dark:bg-purple-900/30">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("channelInsights.margin")}
                        </p>
                        <p className="text-lg font-semibold">£194,884.00</p>
                      </div>
                    </div>

                    {/* Margin % */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center dark:bg-orange-900/30">
                        <Percent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("channelInsights.marginPercent")}
                        </p>
                        <p className="text-lg font-semibold">23%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {t("teamMembers.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-[240px]">
                    {channel?.teamMembers && channel?.teamMembers.length > 0 ? (
                      channel?.teamMembers.map((member: any, index: number) => (
                        <div
                          key={member.id || index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={getAvatarColor(index)}>
                              {getInitials(
                                member.name ||
                                  member.firstName + " " + member.lastName ||
                                  "N A"
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">
                              {member.name ||
                                `${member.firstName} ${member.lastName}`}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {member.email}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {member.role === "channelManager" &&
                              t("teamMembers.channelManager")}
                            {member.role === "contentEditor" &&
                              t("teamMembers.contentEditor")}
                            {member.role === "administrator" &&
                              t("teamMembers.administrator")}
                            {![
                              "channelManager",
                              "contentEditor",
                              "administrator",
                            ].includes(member.role) && member.role}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t("teamMembers.noMembers")}</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Notes notes={notes} currentUser={currentUser} companyId={id} />
            </div>
          </div>
        </form>
      </Form>

      {/* Image Upload Dialogs */}
      <ImageUpload
        open={logoUploadOpen}
        onOpenChange={setLogoUploadOpen}
        onUpload={handleLogoUpload}
        maxFiles={1}
      />

      <ImageUpload
        open={iconUploadOpen}
        onOpenChange={setIconUploadOpen}
        onUpload={handleIconUpload}
        maxFiles={1}
      />

      <ImageUpload
        open={faviconUploadOpen}
        onOpenChange={setFaviconUploadOpen}
        onUpload={handleFaviconUpload}
        maxFiles={1}
      />

      <ImageUpload
        open={logoDarkUploadOpen}
        onOpenChange={setLogoDarkUploadOpen}
        onUpload={handleLogoDarkUpload}
        maxFiles={1}
      />

      <ImageUpload
        open={iconDarkUploadOpen}
        onOpenChange={setIconDarkUploadOpen}
        onUpload={handleIconDarkUpload}
        maxFiles={1}
      />

      <ImageUpload
        open={faviconDarkUploadOpen}
        onOpenChange={setFaviconDarkUploadOpen}
        onUpload={handleFaviconDarkUpload}
        maxFiles={1}
      />
    </div>
  );
};

export default ChannelForm;
