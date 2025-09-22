/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "@workspace/ui/lib/zod";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useCallback, useEffect, useState } from "react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@workspace/ui/components/file-upload";
import { Upload, X } from "@workspace/ui/lucide-react";
import { toast } from "@workspace/ui/sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Define schema for brand editing
const formSchema = z.object({
  value: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  logoUrl: z.string().min(1, { message: "Logo is required" }),
  iconUrl: z
    .string()
    .url({
      message: "Please enter a valid URL for the icon.",
    })
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

// Define a Brand interface
interface Brand {
  id?: string;
  value?: string;
  logoUrl?: string;
  iconUrl?: string | null;
}

interface BrandFormProps {
  brand?: Brand; // Optional brand for editing mode
  onSubmit: (data: any) => void; // Callback for form submission
  onCancel: () => void; // Callback for cancellation
  onOpenChange: (open: boolean) => void; // Callback for dialog open/close
  includeIcon?: boolean; // Whether to include icon field (default: true)
}

const BrandForm = ({
  brand,
  onSubmit,
  onCancel,
  onOpenChange,
  includeIcon = true,
}: BrandFormProps) => {
  const MAX_FILES = 1;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const FILE_TYPES = ".png, .webp, .jpg, .jpeg";
  const FILE_TYPES_RENDER = FILE_TYPES.replace(".", "").toUpperCase();
  const [logo, setLogo] = useState<File[]>([]);
  const [icon, setIcon] = useState<File[]>([]);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeIcon, setRemoveIcon] = useState(false);

  const isEditMode = !!brand?.id;
  const ft = useTranslations("Forms");
  const t = useTranslations("Products.Attributes.Brands");
  const ct = useTranslations("Common");

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: brand?.value || "",
      logoUrl: brand?.logoUrl || "",
      iconUrl: brand?.iconUrl || "",
    },
  });

  // Update form values when brand data changes
  useEffect(() => {
    if (brand) {
      form.reset({
        value: brand.value || "",
        logoUrl: brand.logoUrl || "",
        iconUrl: brand.iconUrl || "",
      });
    }
  }, [brand, form]);

  // Handle form submission
  const handleFormSubmit = (values: FormValues) => {
    // Validate logo presence
    if (removeLogo && logo.length === 0) {
      form.setError("logoUrl", {
        type: "manual",
        message: "Logo is required. Please upload a logo image.",
      });
      return;
    }

    // Create submission data
    const submissionData = {
      ...values,
      id: brand?.id,
      newLogoFile: logo.length > 0 ? logo[0] : undefined,
      newIconFile: icon.length > 0 ? icon[0] : undefined,
      removeLogo: removeLogo && logo.length > 0, // Only allow removing if new logo is uploaded
      removeIcon: removeIcon,
    };

    onSubmit(submissionData);
    onOpenChange(false);
    toast.success(
      isEditMode ? "Brand updated successfully" : "Brand added successfully"
    );
  };

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (logo.length >= MAX_FILES) {
        return ft("Error.numberOfFiles", {
          number: MAX_FILES,
        });
      }

      if (includeIcon) {
        if (icon.length >= MAX_FILES) {
          return ft("Error.numberOfFiles", {
            number: MAX_FILES,
          });
        }
      }

      // Validate file type (only images)
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/webp" &&
        file.type !== "image/jpg"
      ) {
        return ft("Error.fileType", {
          type: FILE_TYPES_RENDER,
        });
      }

      // Validate file size (max 10MB)
      if (file.size > MAX_SIZE) {
        return ft("Error.fileSize", {
          size: MAX_SIZE / (1024 * 1024),
        });
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [logo, icon, includeIcon, ft]
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // Handle logo removal attempts - only allow if a new logo is being uploaded
  const handleLogoRemove = () => {
    if (logo.length > 0) {
      setRemoveLogo(true);
    } else {
      toast.error(
        "Logo is required. Please upload a new logo before removing the current one."
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("brandName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterBrandName")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-2">
          {ct("logo")} <span className="text-red-500">*</span>
        </div>
        {!removeLogo && form.getValues("logoUrl") ? (
          <div className="relative w-full max-w-md">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2 z-10 size-5 rounded-full"
              onClick={handleLogoRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image
              src={form.getValues("logoUrl") || ""}
              alt="Brand Logo"
              width={150}
              height={150}
              className="object-contain rounded-md border border-border"
            />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUpload
                    value={logo}
                    onValueChange={(files) => {
                      setLogo(files);
                      // Update the form field value when files change
                      if (files.length > 0) {
                        // Create a temporary URL or just set a placeholder value
                        // We'll use the actual file in submission
                        field.onChange(files[0]?.name ?? ""); // Set field value to filename at minimum
                        form.clearErrors("logoUrl");
                      } else {
                        field.onChange(""); // Clear the field if no files
                      }
                    }}
                    onFileValidate={onFileValidate}
                    onFileReject={onFileReject}
                    accept={FILE_TYPES}
                    maxFiles={MAX_FILES}
                    className="w-full max-w-md group"
                    maxSize={MAX_SIZE}
                    multiple
                  >
                    {logo.length < MAX_FILES && (
                      <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 space-y-2">
                          <div className="flex items-center justify-center">
                            <Upload className="size-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">
                            {ft("uploadTitle")}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {ft("filesOnly", {
                              type: FILE_TYPES_RENDER,
                              size: MAX_SIZE / (1024 * 1024),
                            })}
                          </p>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-fit"
                          >
                            {ft("browseFiles")}
                          </Button>
                        </FileUploadTrigger>
                      </FileUploadDropzone>
                    )}

                    <FileUploadList>
                      {logo.map((file) => (
                        <FileUploadItem key={file.name} value={file}>
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {includeIcon && (
          <>
            <div className="mb-2">{ct("icon")}</div>
            {!removeIcon && form.getValues("iconUrl") ? (
              <div className="relative w-full max-w-md">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2 z-10 size-5 rounded-full"
                  onClick={() => setRemoveIcon(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Image
                  src={form.getValues("iconUrl") || ""}
                  alt="Brand icon"
                  width={150}
                  height={150}
                  className="object-contain rounded-md border border-border"
                />
              </div>
            ) : (
              <FileUpload
                value={icon}
                onValueChange={setIcon}
                onFileValidate={onFileValidate}
                onFileReject={onFileReject}
                accept={FILE_TYPES}
                maxFiles={MAX_FILES}
                className="w-full max-w-md group"
                maxSize={MAX_SIZE}
                multiple
              >
                {icon.length < MAX_FILES && (
                  <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 space-y-2">
                      <div className="flex items-center justify-center">
                        <Upload className="size-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">{ft("uploadTitle")}</p>
                      <p className="text-muted-foreground text-xs">
                        {ft("filesOnly", {
                          type: FILE_TYPES_RENDER,
                          size: MAX_SIZE / (1024 * 1024),
                        })}
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                      >
                        {ft("browseFiles")}
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                )}

                <FileUploadList>
                  {icon.map((file) => (
                    <FileUploadItem key={file.name} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X className="h-4 w-4" />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            )}
          </>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            {ct("cancel")}
          </Button>
          <Button type="submit">
            {isEditMode ? ct("update") : ct("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BrandForm;
