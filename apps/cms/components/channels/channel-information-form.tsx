"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { z } from "@workspace/ui/lib/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
import { ImageUpload } from "../image-upload";
import { NewChannelFormData } from "./new-channel-form";
import companiesData from "@/data/companies.json";
import countriesData from "@/data/countries.json";
import currenciesData from "@/data/currencies.json";
import { supportedLocalesJson } from "@/data/supportedLocales";
import { Upload } from "@workspace/ui/lucide-react";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";

interface ChannelInformationFormProps {
  onSubmit: (data: Partial<NewChannelFormData>) => void;
  onBack: () => void;
  formData: NewChannelFormData;
}

function ChannelInformationForm({
  onSubmit,
  onBack,
  formData,
}: ChannelInformationFormProps) {
  const t = useTranslations("Channels.NewChannel.stepTwo");
  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const [iconUploadOpen, setIconUploadOpen] = useState(false);
  const [faviconUploadOpen, setFaviconUploadOpen] = useState(false);

  // Generate next channel ID (simulate auto-generation)
  const nextChannelId = companiesData.length + 1;

  const formSchema = z
    .object({
      channelName: z
        .string()
        .min(1, { message: t("validation.channelNameRequired") }),
      channelId: z.number(),
      description: z
        .string()
        .min(1, { message: t("validation.descriptionRequired") }),
      companyId: z
        .string()
        .min(1, { message: t("validation.companyRequired") }),
      domainType: z.enum(["default", "custom"]),
      customDomain: z.string().optional(),
      defaultLocation: z
        .string()
        .min(1, { message: t("validation.defaultLocationRequired") }),
      defaultCurrency: z
        .string()
        .min(1, { message: t("validation.defaultCurrencyRequired") }),
      defaultLanguage: z
        .string()
        .min(1, { message: t("validation.defaultLanguageRequired") }),
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
        message: t("validation.customDomainRequired"),
        path: ["customDomain"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: formData.channelName || "",
      channelId: formData.channelId === 1 ? nextChannelId : formData.channelId,
      description: formData.description || "",
      companyId: formData.companyId || "",
      domainType: formData.domainType || "default",
      customDomain: formData.customDomain || "",
      defaultLocation: formData.defaultLocation || "",
      defaultCurrency: formData.defaultCurrency || "",
      defaultLanguage: formData.defaultLanguage || "",
    },
  });

  const watchDomainType = form.watch("domainType");
  const watchChannelId = form.watch("channelId");

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const submissionData = {
      ...data,
      logo: formData.logo,
      icon: formData.icon,
      favicon: formData.favicon,
    };
    onSubmit(submissionData);
  };

  const handleLogoUpload = (files: File[]) => {
    if (files.length > 0) {
      formData.logo = files[0] as File;
    }
    setLogoUploadOpen(false);
  };

  const handleIconUpload = (files: File[]) => {
    if (files.length > 0) {
      formData.icon = files[0] as File;
    }
    setIconUploadOpen(false);
  };

  const handleFaviconUpload = (files: File[]) => {
    if (files.length > 0) {
      formData.favicon = files[0] as File;
    }
    setFaviconUploadOpen(false);
  };

  const generateDefaultDomain = (channelId: number) => {
    return `preview-${channelId}-app.kalixo.com`;
  };

  return (
    <div className="max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Channel Name */}
              <FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.channelName.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("fields.channelName.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Channel ID */}
              <FormField
                control={form.control}
                name="channelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.channelId.label")}</FormLabel>
                    <FormControl>
                      <Input type="number" disabled {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("fields.channelId.description")}
                    </FormDescription>
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
                    <FormLabel>{t("fields.description.label")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("fields.description.placeholder")}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Selection */}
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.company.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("fields.company.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesData.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <FormLabel>{t("fields.channelUrl.label")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="default" />
                          <Label htmlFor="default">
                            {t("fields.channelUrl.defaultDomain")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="custom" />
                          <Label htmlFor="custom">
                            {t("fields.channelUrl.customDomain")}
                          </Label>
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
                    value={generateDefaultDomain(watchChannelId)}
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
                          placeholder={t("fields.channelUrl.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>{t("fields.logo.label")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setLogoUploadOpen(true)}
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">
                      {formData.logo ? formData.logo.name : "Upload Logo"}
                    </span>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t("fields.logo.description")}
                  </p>
                </div>

                {/* Icon Upload */}
                <div className="space-y-2">
                  <Label>{t("fields.icon.label")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setIconUploadOpen(true)}
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">
                      {formData.icon ? formData.icon.name : "Upload Icon"}
                    </span>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t("fields.icon.description")}
                  </p>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-2">
                  <Label>{t("fields.favicon.label")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                    onClick={() => setFaviconUploadOpen(true)}
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">
                      {formData.favicon
                        ? formData.favicon.name
                        : "Upload Favicon"}
                    </span>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t("fields.favicon.description")}
                  </p>
                </div>
              </div>

              {/* Default Location */}
              <FormField
                control={form.control}
                name="defaultLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.defaultLocation.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "fields.defaultLocation.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countriesData.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            <CircleFlag
                              countryCode={country.value.toLowerCase()}
                              className="mr-2 w-4 h-4"
                            />
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Default Currency */}
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.defaultCurrency.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "fields.defaultCurrency.placeholder"
                            )}
                          />
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

              {/* Default Language */}
              <FormField
                control={form.control}
                name="defaultLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.defaultLanguage.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "fields.defaultLanguage.placeholder"
                            )}
                          />
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            {t("back")}
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            {t("continue")}
          </Button>
        </CardFooter>
      </Card>

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
    </div>
  );
}

export default ChannelInformationForm;
