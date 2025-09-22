"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "@workspace/ui/lib/react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { Plus, Copy, RefreshCw } from "@workspace/ui/lucide-react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

// Zod schema for form validation
const applicationSchema = z.object({
  applicationName: z.string().min(1, "Application name is required"),
  redirectUrls: z
    .array(
      z.object({
        url: z.string().url("Please enter a valid URL"),
      })
    )
    .min(1, "At least one redirect URL is required"),
  category: z.enum(["web", "desktop", "mobile"], {
    message: "Please select a category",
  }),
  clientType: z.enum(["confidential", "public"], {
    message: "Please select a client type",
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

// Generate random client ID and secret
const generateClientId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const generateClientSecret = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

interface NewApplicationDialogProps {
  application?: {
    id: string;
    name: string;
    url: string;
    environment: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    company: string;
    apiKey?: string;
    description?: string;
    category?: string;
    clientType?: string;
  };
}

function NewApplicationDialog({ application }: NewApplicationDialogProps = {}) {
  const [open, setOpen] = useState(!!application);
  const [showCredentials, setShowCredentials] = useState(false);
  const [clientId, setClientId] = useState(application?.apiKey || "");
  const [clientSecret, setClientSecret] = useState("");

  const t = useTranslations("Settings.APISettings.newApplicationDialog");
  const ct = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEditing = !!application;

  // Extract redirect URLs from application URL (for edit mode)
  const getDefaultRedirectUrls = () => {
    if (application) {
      return [{ url: application.url }];
    }
    return [{ url: "" }];
  };

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicationName: application?.name || "",
      redirectUrls: getDefaultRedirectUrls(),
      category: application?.category?.toLowerCase() as
        | "web"
        | "desktop"
        | "mobile"
        | undefined,
      clientType: application?.clientType?.toLowerCase() as
        | "confidential"
        | "public"
        | undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "redirectUrls",
  });

  // Reset form when application changes
  useEffect(() => {
    if (application) {
      form.reset({
        applicationName: application.name,
        redirectUrls: [{ url: application.url }],
        category: application.category?.toLowerCase() as
          | "web"
          | "desktop"
          | "mobile"
          | undefined,
        clientType: application.clientType?.toLowerCase() as
          | "confidential"
          | "public"
          | undefined,
      });
      setClientId(application.apiKey || "");
      setOpen(true);
    }
  }, [application, form]);

  const handleAddRedirectUrl = () => {
    append({ url: "" });
  };

  const handleRemoveRedirectUrl = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = (data: ApplicationFormData) => {
    console.log("Application data:", data);

    // Generate credentials
    const newClientId = generateClientId();
    const newClientSecret = generateClientSecret();
    setClientId(newClientId);
    setClientSecret(newClientSecret);

    // Show success toast
    toast.success(t("applicationCreated"), {
      description: t("applicationCreatedDescription"),
    });

    // Show credentials section
    setShowCredentials(true);
  };

  const handleGenerateNewSecret = () => {
    const newSecret = generateClientSecret();
    setClientSecret(newSecret);
    toast.success(t("secretRegenerated"));
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copiedToClipboard", { type }));
  };

  const handleClose = () => {
    setShowCredentials(false);
    form.reset();
    setClientId("");
    setClientSecret("");
    setOpen(false);

    // Remove edit parameter from URL if we were editing
    if (isEditing) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("title")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {!showCredentials
              ? isEditing
                ? t("editApplication")
                : t("applicationDetails")
              : t("apiCredentials")}
          </DialogTitle>
          <DialogDescription>
            {!showCredentials
              ? t("credentialsDescription")
              : t("apiCredentialsDescription")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          {!showCredentials ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Application Details Section */}
                <div className="space-y-4">
                  {/* Application Name */}
                  <FormField
                    control={form.control}
                    name="applicationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("applicationName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("applicationNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("applicationNameDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* OAuth Redirect URLs */}
                  <div className="space-y-3">
                    <Label>{t("redirectUrls")}</Label>
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`redirectUrls.${index}.url`}
                        render={({ field: urlField }) => (
                          <FormItem>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  placeholder={t("redirectUrlPlaceholder")}
                                  {...urlField}
                                />
                              </FormControl>
                              {index === fields.length - 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={handleAddRedirectUrl}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemoveRedirectUrl(index)}
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                            {index === 0 && (
                              <FormDescription>
                                {t("redirectUrlsDescription")}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("category")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("selectCategory")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web">
                              {t("categories.web")}
                            </SelectItem>
                            <SelectItem value="desktop">
                              {t("categories.desktop")}
                            </SelectItem>
                            <SelectItem value="mobile">
                              {t("categories.mobile")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("categoryDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Client Type */}
                  <FormField
                    control={form.control}
                    name="clientType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t("clientType")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="confidential"
                                id="confidential"
                              />
                              <Label htmlFor="confidential">
                                {t("clientTypes.confidential")}
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6 mb-4">
                              {t("clientTypes.confidentialDescription")}
                            </p>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="public" id="public" />
                              <Label htmlFor="public">
                                {t("clientTypes.public")}
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">
                              {t("clientTypes.publicDescription")}
                            </p>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          ) : (
            /* API Credentials Section */
            <div className="space-y-6">
              {/* Client ID */}
              <div className="space-y-2">
                <Label>{t("clientId")}</Label>
                <div className="flex gap-2">
                  <Input value={clientId} readOnly className="font-mono" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyToClipboard(clientId, "Client ID")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("clientIdDescription")}
                </p>
              </div>

              {/* Client Secret */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t("clientSecret")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateNewSecret}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("generateNewSecret")}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input value={clientSecret} readOnly className="font-mono" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleCopyToClipboard(clientSecret, "Client Secret")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("clientSecretDescription")}
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          {!showCredentials ? (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                {ct("cancel")}
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} type="button">
                {isEditing ? t("updateApplication") : t("createApplication")}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>{ct("done")}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewApplicationDialog;
