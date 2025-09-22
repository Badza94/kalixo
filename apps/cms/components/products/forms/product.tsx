/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm, type Resolver } from "@workspace/ui/lib/react-hook-form";
import { format } from "@workspace/ui/lib/date-fns";
import {
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Plus,
  RefreshCw,
  WandSparkles,
  X,
} from "@workspace/ui/lucide-react";
import * as z from "@workspace/ui/lib/zod";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { cn } from "@workspace/ui/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import PageTitle from "../../page-title";
import { useTranslations } from "next-intl";
import { Separator } from "@workspace/ui/components/separator";
import { ImageUpload } from "../../image-upload";
import Image from "next/image";
import { ProductStatusBadge } from "../../status-badge";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { SelectSearch } from "@workspace/ui/components/select-search";
import ProductAIDialog from "../ai-dialog";
import ProductSyncDialog from "../dialogs/sync";
import { Link } from "@/i18n/routing";

enum STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  DEMO = "demo",
  COMING_SOON = "coming_soon",
  TEST = "test",
  NOT_SYNCED = "not_synced",
}

const PRODUCT_STATUSES = [
  {
    label: "Active",
    value: STATUS.ACTIVE,
  },
  {
    label: "Inactive",
    value: STATUS.INACTIVE,
  },
  {
    label: "Deleted",
    value: STATUS.DELETED,
  },
  {
    label: "Demo",
    value: STATUS.DEMO,
  },
  {
    label: "Coming Soon",
    value: STATUS.COMING_SOON,
  },
  {
    label: "Test",
    value: STATUS.TEST,
  },
  {
    label: "Not Synced",
    value: STATUS.NOT_SYNCED,
  },
];

// Available options for multiselect
const categoryOptions = [
  "Gaming",
  "Software",
  "Hardware",
  "Accessories",
  "Digital Content",
];
const subcategoryOptions = [
  "Classic",
  "PC",
  "Console",
  "Mobile",
  "VR",
  "Strategy",
  "Action",
  "RPG",
  "Simulation",
];
const tagOptions = [
  "Xbox",
  "Microsoft",
  "Digital Code",
  "PlayStation",
  "Nintendo",
  "Steam",
  "Epic",
  "EA",
  "Ubisoft",
];

type ProductImage = {
  id?: string; // For backend identification
  url: string; // URL for existing images or object URL for new uploads
  file?: File; // File object for new uploads
  isDefault: boolean;
};

type TProductFormProps = {
  id: string;
  currencies: any[];
  countries: any[];
  brands: any[];
  productTypes: any[];
  product?: any;
};

export default function ProductForm({
  id,
  currencies,
  countries,
  brands,
  productTypes,
  product,
}: TProductFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  const t = useTranslations("Products");
  const ft = useTranslations("Products.Form");
  const fet = useTranslations("Products.Form.Errors");
  const ct = useTranslations("Common");

  useEffect(() => {
    if (!product) {
      setIsEditing(true);
    }
  }, [product]);

  const formSchema = z.object({
    // Product Details
    title: z.string().min(2, { message: fet("titleRequired") }),
    brand: z.string().min(1, { message: fet("brandRequired") }),
    countryCode: z.string().min(1, { message: fet("countryCodeRequired") }),
    languageCode: z.string().min(1, { message: fet("languageCodeRequired") }),
    sku: z.string().min(1, { message: fet("skuRequired") }),
    ean: z.string().min(1, { message: fet("eanRequired") }),
    productType: z.string().min(1, { message: fet("productTypeRequired") }),
    denomination: z.string().min(1, { message: fet("denominationRequired") }),
    price: z.number().min(1, { message: fet("priceRequired") }),
    currencyCode: z.string().min(1, { message: fet("currencyCodeRequired") }),
    discount: z.string().optional(),
    reducedPrice: z.string().optional(),

    // Expiry settings
    expiryType: z.enum(["no_expiry", "set_expiry"]),
    expiryPeriod: z.number().min(1).optional(),

    // Release
    releaseDate: z.date().optional(),

    // Descriptions
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    termsAndConditions: z.string().optional(),
    redemptionInstructions: z.string().optional(),

    // Additional Information
    edition: z.string().optional(),
    platform: z.string().optional(),
    package: z.string().optional(),
    region: z.string().optional(),
    languageAdditional: z.string().optional(),
    ageRestriction: z.string().optional(),

    // Search engine listing
    pageTitle: z.string().optional(),
    urlHandle: z.string().optional(),
    metaDescription: z.string().optional(),

    // Global name
    globalName: z.string().optional(),

    // Category
    category: z.array(z.string()).default([]),
    subCategories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    // Images
    images: z
      .array(
        z.object({
          id: z.string().optional(),
          url: z.string(),
          file: z.instanceof(File).optional(),
          isDefault: z.boolean().default(false),
        })
      )
      .default([]),

    // status
    status: z.enum(Object.values(STATUS) as [string, ...string[]]).optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues, any>,
    defaultValues: {
      title: product?.title || "",
      brand: product?.brand || "",
      countryCode: product?.countryCode || "",
      languageCode: product?.languageCode || "",
      sku: product?.sku || "",
      ean: product?.ean || "",
      productType: product?.productType || "",
      denomination: product?.denomination || "fixed",
      price: typeof product?.price === "number" ? product.price : 0,
      currencyCode: "GBP",
      discount: product?.discount || "0",
      reducedPrice: product?.reducedPrice || "0.00",
      expiryType: product?.expiryType || "no_expiry",
      expiryPeriod:
        typeof product?.expiryPeriod === "number" ? product.expiryPeriod : 1,
      shortDescription: product?.shortDescription || "",
      longDescription: product?.longDescription || "",
      termsAndConditions: product?.termsAndConditions || "",
      redemptionInstructions: product?.redemptionInstructions || "",
      edition: product?.edition || "",
      platform: product?.platform || "",
      package: product?.package || "",
      region: product?.region || "",
      languageAdditional: product?.languageAdditional || "en",
      ageRestriction: product?.ageRestriction || "",
      pageTitle: product?.pageTitle || "",
      urlHandle: product?.urlHandle || "",
      metaDescription: product?.metaDescription || "",
      globalName: product?.globalName || "",
      category: Array.isArray(product?.category)
        ? (product.category as string[])
        : [],
      subCategories: Array.isArray(product?.subCategories)
        ? (product.subCategories as string[])
        : [],
      tags: Array.isArray(product?.tags) ? (product.tags as string[]) : [],
      images: Array.isArray(product?.images)
        ? (product.images as ProductImage[])
        : [],
      status: product?.status || STATUS.COMING_SOON,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    setIsEditing(false);
    // Here you would typically send the updated values to your API
  }

  // Handle image uploads
  const handleImageUpload = (files: File[]) => {
    const currentImages = [...form.getValues("images")];

    // Create new image objects from the uploaded files
    const newImages: ProductImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
      isDefault: currentImages.length === 0, // Make the first image default if no images exist
    }));

    form.setValue("images", [...currentImages, ...newImages]);
    setOpenImageUpload(false);
  };

  // Update removeImage function
  const removeImage = (index: number) => {
    const images = [...form.getValues("images")];

    // If removing the default image, set first remaining image as default
    // If removing the default image, set first remaining image as default
    if (images[index]?.isDefault && images.length > 1) {
      // Remove the image first
      images.splice(index, 1);
      // Set the first image as default if it exists
      if (images[0]) {
        images[0].isDefault = true;
      }
    } else {
      // Remove the image
      images.splice(index, 1);
    }

    form.setValue("images", images);
  };

  const setDefaultImage = (index: number) => {
    const images = [...form.getValues("images")];

    // Set isDefault to false for all images
    const updatedImages = images.map((img) => ({
      ...img,
      isDefault: false,
    }));

    // Safely set the selected image as default if it exists
    if (updatedImages[index]) {
      updatedImages[index].isDefault = true;
    }

    form.setValue("images", updatedImages);
  };

  const languagesData = countries.flatMap((country) => {
    // get the languages array from the country object depending on selected country
    const languages =
      country.value === form.watch("countryCode") ? country.languages : [];
    return languages.map((lang: any) => ({
      value: lang.lngShort,
      label: lang.language,
    }));
  });

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

  const commercialCurrency = currencies.find(
    (currency) => currency.value === product?.commercials?.buyingPriceCurrency
  );

  const handleAcceptAiSuggestions = async (aiSuggestions: any) => {
    form.setValue("title", aiSuggestions.title);
    form.setValue("longDescription", aiSuggestions.longDescription);
    form.setValue("shortDescription", aiSuggestions.shortDescription);
    form.setValue("tags", aiSuggestions.tags);
    form.setValue("category", aiSuggestions.category);
    form.setValue("subCategories", aiSuggestions.subCategories);
    form.setValue("productType", aiSuggestions.productType);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <PageTitle
            title="Test Product"
            description={`${t("productId")}: ${id}`}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          {isEditing && (
            <div className="bg-muted rounded-lg p-0.5 flex items-center mr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSyncDialogOpen(true)}
                title={t("syncProductData")}
                className="rounded-md h-8 px-2 hover:bg-primary hover:text-primary-foreground"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                title={t("aiEnhancement")}
                onClick={() => setAIDialogOpen(true)}
                className="rounded-md h-8 px-2 hover:bg-primary hover:text-primary-foreground"
              >
                <WandSparkles className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isEditing ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
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
              onClick={() => setIsEditing(true)}
              className="animate-fade-in transition-all duration-200 ease-in-out"
            >
              {ct("edit")}
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("detailsTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("productTitle")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("enterProductTitle")}
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
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("productBrand")}</FormLabel>
                            <FormControl>
                              <SelectSearch
                                data={brands}
                                placeholder={ft("selectBrand")}
                                nothingFound={ft("brandNotFound")}
                                value={field.value}
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
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("productCountry")}</FormLabel>
                            <FormControl>
                              <SelectSearch
                                data={countriesData}
                                placeholder={ft("selectCountry")}
                                nothingFound={ft("countryNotFound")}
                                value={field.value}
                                setValue={(value) => {
                                  field.onChange(value);
                                  form.setValue("languageCode", "");
                                }}
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
                        name="languageCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {ft("productLanguage")} {field.value}
                            </FormLabel>
                            <FormControl>
                              <SelectSearch
                                data={languagesData}
                                placeholder={ft("selectLanguage")}
                                nothingFound={ft("languageNotFound")}
                                value={field.value || languagesData?.[0]?.value}
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
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("sku")}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="ean"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("ean")}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* This should be a select */}
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="productType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("type")}</FormLabel>
                            <FormControl>
                              <SelectSearch
                                data={productTypes}
                                placeholder={ft("selectProductType")}
                                nothingFound={ft("productTypeNotFound")}
                                value={field.value}
                                setValue={(value) => {
                                  field.onChange(value);
                                }}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="my-8" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="denomination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("denomination")}</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select denomination" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">
                                  {ft("fixed")}
                                </SelectItem>
                                <SelectItem value="variable">
                                  {ft("variable")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("price")}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="currencyCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("currency")}</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={ft("selectCurrency")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem
                                    key={`${currency.value}-${currency.countryCode}`}
                                    value={currency.value}
                                  >
                                    {currency.symbol} {currency.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("discount")} (%)</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="reducedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("reducedPrice")}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <FormField
                        control={form.control}
                        name="expiryType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>{ft("expirySettings")}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                disabled={!isEditing}
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no_expiry" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {ft("noExpiry")}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="set_expiry" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {ft("setExpiryPeriod")}
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("expiryType") === "set_expiry" && (
                        <FormField
                          control={form.control}
                          name="expiryPeriod"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormControl>
                                <div className="flex items-center">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-r-none"
                                    onClick={() => {
                                      if (field.value && field.value > 1) {
                                        field.onChange(Number(field.value) - 1);
                                      }
                                    }}
                                    disabled={!isEditing || field.value === 1}
                                  >
                                    -
                                  </Button>
                                  <div className="h-8 px-3 flex items-center justify-center">
                                    {field.value}{" "}
                                    {field.value === 1
                                      ? ct("year")
                                      : ct("years")}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-l-none"
                                    onClick={() => {
                                      field.onChange(
                                        (Number(field.value) || 0) + 1
                                      );
                                    }}
                                    disabled={!isEditing}
                                  >
                                    +
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("imagesTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("imagesDescription")}
                  </p>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                          <div className="col-span-2">
                            {field.value.map((image, index) => (
                              <div
                                key={index}
                                className="border rounded-md p-2 aspect-square flex flex-col items-center justify-center relative"
                              >
                                {image.isDefault && (
                                  <Badge className="absolute top-4 left-4 z-10">
                                    {ct("default")}
                                  </Badge>
                                )}
                                <Image
                                  src={image.url || "/placeholder.svg"}
                                  fill
                                  alt={`Product Image ${index + 1}`}
                                  className="object-cover rounded-md"
                                  onLoad={(e) => {
                                    // Only revoke object URLs for newly uploaded files
                                    if (
                                      image.file &&
                                      e.target instanceof HTMLImageElement
                                    ) {
                                      URL.revokeObjectURL(e.target.src);
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                                {isEditing && (
                                  <div className="absolute bottom-2 right-2 flex gap-2">
                                    {!image.isDefault && (
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setDefaultImage(index)}
                                      >
                                        {ct("setDefault")}
                                      </Button>
                                    )}
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeImage(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => setOpenImageUpload(true)}
                                className="border-2 aspect-square w-full h-full border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
                              >
                                <Plus className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {ct("addImage")}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  600x600px
                                </span>
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ImageUpload
                    open={openImageUpload}
                    onOpenChange={setOpenImageUpload}
                    onUpload={handleImageUpload}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("releaseTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{ft("releaseDate")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!isEditing}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{ct("pickADate")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem
                  value="short-longDescription"
                  className="bg-card text-card-foreground border shadow-sm rounded-xl px-6"
                >
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold">
                      {ft("shortDescription")}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              placeholder={ft("enterShortDescription")}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="longDescription"
                  className="bg-card text-card-foreground border shadow-sm rounded-xl px-6"
                >
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold">
                      {ft("description")}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              placeholder={ft("enterDescription")}
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="terms"
                  className="bg-card text-card-foreground border shadow-sm rounded-xl px-6"
                >
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold">
                      {ft("termsAndConditions")}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="termsAndConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              placeholder={ft("enterTermsAndConditions")}
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="redemption"
                  className="bg-card text-card-foreground border shadow-sm rounded-xl px-6"
                >
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold">
                      {ft("redemptionInstructions")}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="redemptionInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              placeholder={ft("enterRedemptionInstructions")}
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Card>
                <CardHeader>
                  <CardTitle>{t("additionalInfoTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">
                        {t("productDetails")}
                      </h3>

                      <FormField
                        control={form.control}
                        name="edition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("edition")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("enterEdition")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("platform")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("enterPlatform")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="package"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("package")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("enterPackage")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">
                        {t("regionAvailability")}
                      </h3>

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("region")}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Maybe this should be a select as well */}
                      <FormField
                        control={form.control}
                        name="languageAdditional"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("productLanguage")}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ageRestriction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{ft("ageRestriction")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder={ft("enterAgeRestriction")}
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
                  <CardTitle>{t("searchEngineTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-md space-y-2">
                    <div className="text-muted-foreground text-sm">
                      (channel_url) › products › {form.getValues("title")}
                    </div>
                    <div className="text-blue-800 font-medium">
                      {form.getValues("pageTitle")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {form.getValues("metaDescription")}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="pageTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ft("pageTitle")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder={ft("enterPageTitle")}
                          />
                        </FormControl>
                        <FormDescription>
                          {ct("charUsed", {
                            start: field?.value?.length || 0,
                            end: 70,
                          })}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urlHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ft("urlHandle")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder={ft("enterUrlHandle")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ft("metaDescription")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder={ft("enterMetaDescription")}
                          />
                        </FormControl>
                        <FormDescription>
                          {ct("charUsed", {
                            start: field?.value?.length || 0,
                            end: 160,
                          })}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
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
                            {PRODUCT_STATUSES.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <ProductStatusBadge
                                  status={ct(status.value.toLowerCase())}
                                />
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

              <Card>
                <CardHeader>
                  <CardTitle>{t("commercialsTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>{ft("vendor")}</span>
                    <span>{product?.commercials.vendor || ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{ft("buyingPrice")}</span>
                    <span>{product?.commercials.buyingPrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{ft("buyingCurrency")}</span>
                    <span>
                      {product
                        ? `${commercialCurrency?.value} (${commercialCurrency?.symbol})`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{ft("commission")}</span>
                    <span>
                      {product ? product?.commercials.commission : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("insightsTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>{ft("totalItems")}</span>
                    <span>
                      {product ? product?.productInsights.totalItems : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{ft("totalSales")}</span>
                    <span>
                      {product
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: product?.currencyCode,
                          }).format(product?.productInsights.totalSales)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{ft("grossProfit")}</span>
                    <span>
                      {product
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: product?.currencyCode,
                          }).format(product?.productInsights.grossProfit)
                        : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{ft("globalName")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="globalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder={ft("enterGlobalName")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{ft("productCategory")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={!isEditing}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value.length && "text-muted-foreground"
                                )}
                              >
                                {field.value.length === 0
                                  ? ft("selectCategories")
                                  : `${field.value.length} ${ct("selected")}`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder={ft("searchCategories")}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {ft("noCategoryFound")}
                                </CommandEmpty>
                                <CommandGroup>
                                  {categoryOptions.map((category) => (
                                    <CommandItem
                                      key={category}
                                      value={category}
                                      onSelect={() => {
                                        const current = field.value || [];
                                        const updated = current.includes(
                                          category
                                        )
                                          ? current.filter(
                                              (item) => item !== category
                                            )
                                          : [...current, category];
                                        field.onChange(updated);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(category)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {category}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {field.value?.map((item) => (
                            <Badge
                              key={item}
                              variant="secondary"
                              className="flex items-center gap-2"
                              onClick={() => {
                                field.onChange(
                                  field.value.filter((i) => i !== item)
                                );
                              }}
                            >
                              {item}
                              {isEditing && (
                                <X
                                  className="h-4 w-4 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(
                                      field.value.filter((i) => i !== item)
                                    );
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{ft("subCategories")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="subCategories"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={!isEditing}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value.length && "text-muted-foreground"
                                )}
                              >
                                {field.value.length === 0
                                  ? "Select subcategories"
                                  : `${field.value.length} selected`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 popover-content-width-same-as-its-trigger">
                            <Command>
                              <CommandInput
                                placeholder={ft("searchSubCategories")}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {ft("noSubCategoryFound")}
                                </CommandEmpty>
                                <CommandGroup>
                                  {subcategoryOptions.map((subcategory) => (
                                    <CommandItem
                                      key={subcategory}
                                      value={subcategory}
                                      onSelect={() => {
                                        const current = field.value || [];
                                        const updated = current.includes(
                                          subcategory
                                        )
                                          ? current.filter(
                                              (item) => item !== subcategory
                                            )
                                          : [...current, subcategory];
                                        field.onChange(updated);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(subcategory)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {subcategory}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((item) => (
                            <Badge
                              key={item}
                              variant="secondary"
                              className="flex items-center gap-1"
                              onClick={() => {
                                field.onChange(
                                  field.value.filter((i) => i !== item)
                                );
                              }}
                            >
                              {item}
                              {isEditing && (
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(
                                      field.value.filter((i) => i !== item)
                                    );
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{ft("tags")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={!isEditing}
                                className={cn(
                                  "w-full justify-between",
                                  !field.value.length && "text-muted-foreground"
                                )}
                              >
                                {field.value.length === 0
                                  ? ft("selectTags")
                                  : `${field.value.length} ${ct("selected")}`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder={ft("searchTags")} />
                              <CommandList>
                                <CommandEmpty>{ft("noTagFound")}</CommandEmpty>
                                <CommandGroup>
                                  {tagOptions.map((tag) => (
                                    <CommandItem
                                      key={tag}
                                      value={tag}
                                      onSelect={() => {
                                        const current = field.value || [];
                                        const updated = current.includes(tag)
                                          ? current.filter(
                                              (item) => item !== tag
                                            )
                                          : [...current, tag];
                                        field.onChange(updated);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(tag)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {tag}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((item) => (
                            <Badge
                              key={item}
                              variant="secondary"
                              className="flex items-center gap-1"
                              onClick={() => {
                                field.onChange(
                                  field.value.filter((i) => i !== item)
                                );
                              }}
                            >
                              {item}
                              {isEditing && (
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(
                                      field.value.filter((i) => i !== item)
                                    );
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("recentActivityTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-muted pl-4 py-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          Changed status from Test to Active
                        </p>
                        <p className="text-sm text-muted-foreground">
                          By store/admin/hype.gg
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mar 19, 2023
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-muted pl-4 py-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          Changed status from Active to Test
                        </p>
                        <p className="text-sm text-muted-foreground">
                          By store/admin/hype.gg
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mar 5, 2023
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      <ProductAIDialog
        open={aiDialogOpen}
        onOpenChange={setAIDialogOpen}
        productId={id || ""}
        handleAcceptAiSuggestions={handleAcceptAiSuggestions}
      />

      <ProductSyncDialog
        open={syncDialogOpen}
        onOpenChange={setSyncDialogOpen}
        originalProduct={product}
        modifiedProduct={form.getValues()} // Get current form values to compare with original
      />
    </div>
  );
}
