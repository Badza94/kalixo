/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
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
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "@workspace/ui/sonner";

export function ImageUpload({
  open,
  onOpenChange,
  onUpload,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  fileTypes = ".png, .webp, .jpg, .jpeg",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
  maxSize?: number;
  maxFiles?: number;
  fileTypes?: string;
}) {
  const MAX_SIZE = maxSize;
  const MAX_FILES = maxFiles;
  const FILE_TYPES = fileTypes;
  const FILE_TYPES_RENDER = FILE_TYPES.replace(".", "").toUpperCase();
  const [files, setFiles] = useState<File[]>([]);

  const ft = useTranslations("Forms");
  const ct = useTranslations("Common");

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files.length > MAX_FILES) {
        return ft("Error.numberOfFiles", {
          number: MAX_FILES,
        });
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

      // Validate file size (max 2MB)
      if (file.size > MAX_SIZE) {
        return ft("Error.fileSize", {
          size: MAX_SIZE / (1024 * 1024),
        });
      }

      return null;
    },
    [files]
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const handleUpload = () => {
    if (onUpload && files.length > 0) {
      onUpload(files);
      setFiles([]);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Add a product image. Images should be 600x600px for best results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileUpload
            value={files}
            onValueChange={setFiles}
            onFileValidate={onFileValidate}
            onFileReject={onFileReject}
            accept={FILE_TYPES}
            maxFiles={MAX_FILES}
            className="w-full max-w-sm group"
            maxSize={MAX_SIZE}
            multiple
          >
            {files.length < MAX_FILES && (
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
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    {ft("browseFiles")}
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
            )}

            <FileUploadList>
              {files.map((file) => (
                <FileUploadItem key={file.name} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload}>
            {ct("upload")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
