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

// Define schema for product type editing
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product type name must be at least 2 characters.",
  }),
  iconUrl: z.string().refine(
    (val) => {
      // Allow empty string for initial form state, but not on submit
      return val !== "";
    },
    {
      message: "Icon is required",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

// Define a Attribute interface
export interface Attribute {
  id?: number;
  name: string;
  iconUrl?: string;
}

interface AttributeFormProps {
  data?: Attribute;
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
  translationKey: string;
}

const AttributeForm = ({
  data,
  onSubmit,
  onCancel,
  onOpenChange,
  translationKey,
}: AttributeFormProps) => {
  const MAX_FILES = 1;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const FILE_TYPES = ".png, .webp, .jpg, .jpeg, .svg";
  const FILE_TYPES_RENDER = FILE_TYPES.replace(".", "").toUpperCase();
  const [icon, setIcon] = useState<File[]>([]);
  const [removeIcon, setRemoveIcon] = useState(false);

  const isEditMode = !!data?.id;
  const ft = useTranslations("Forms");
  const ct = useTranslations("Common");
  const t = useTranslations(`Products.Attributes.${translationKey}`);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      iconUrl: data?.iconUrl || "",
    },
  });

  // Update form values when product type data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        iconUrl: data.iconUrl || "",
      });
    }
  }, [data, form]);

  // Add effect to update form value when icon is removed
  useEffect(() => {
    if (removeIcon) {
      form.setValue("iconUrl", "");
    }
  }, [removeIcon, form]);

  // Handle form submission
  function handleFormSubmit(values: FormValues) {
    // Don't submit if icon is removed and no new icon is uploaded
    if (removeIcon && icon.length === 0) {
      toast.error("Icon is required");
      return;
    }

    // Create submission data
    const submissionData = {
      ...values,
      id: data?.id,
      newIconFile: icon.length > 0 ? icon[0] : undefined,
      removeIcon: removeIcon,
    };

    onSubmit(submissionData);
    onOpenChange(false);
    toast.success(isEditMode ? t("updateSuccess") : t("createSuccess"));
  }

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (icon.length >= MAX_FILES) {
        return ft("Error.numberOfFiles", {
          number: MAX_FILES,
        });
      }

      // Validate file type (only images)
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/webp" &&
        file.type !== "image/jpg" &&
        file.type !== "image/svg+xml"
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
    [icon, ft]
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              alt="Product type icon"
              width={150}
              height={150}
              className="object-contain rounded-md border border-border"
            />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="iconUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUpload
                    value={icon}
                    onValueChange={(files) => {
                      setIcon(files);
                      if (files && files.length > 0) {
                        // Set field value to filename at minimum
                        field.onChange(files[0]?.name ?? "");
                        form?.clearErrors?.("iconUrl");
                      } else {
                        field.onChange("");
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
                    {icon.length < MAX_FILES && (
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
                      {icon.map((file) => (
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

export default AttributeForm;
