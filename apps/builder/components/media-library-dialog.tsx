"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Upload, Check } from "@workspace/ui/lucide-react";
import { toast } from "sonner";

interface MediaItem {
  name: string;
  url: string;
}

interface MediaLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}

export function MediaLibraryDialog({
  isOpen,
  onClose,
  onSelect,
  currentValue,
}: MediaLibraryDialogProps) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentValue || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/media");
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Image uploaded successfully!");

        // Refresh the list
        await fetchImages();

        // Auto-select the newly uploaded image
        setSelectedImage(data.url);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  const selectedImageData = images.find((img) => img.url === selectedImage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Select an image from your library or upload a new one
          </DialogDescription>
        </DialogHeader>

        {/* Upload Button */}
        <div className="flex gap-2 pb-4 border-b">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            size="sm"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {/* Main Content: Grid + Preview */}
        <div className="flex flex-1 gap-4 min-h-0">
          {/* Images Grid */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading images...</div>
              </div>
            ) : images.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-gray-500">
                  <p className="mb-2">No images in your library</p>
                  <p className="text-sm">
                    Upload your first image to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 p-2">
                {images.map((image) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:border-blue-400 ${
                      selectedImage === image.url
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {selectedImage === image.url && (
                      <div className="absolute top-2 right-2 p-1 text-white bg-blue-500 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute right-0 bottom-0 left-0 p-1 text-xs text-white truncate bg-black/60">
                      {image.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {selectedImage && (
            <div className="flex flex-col gap-4 pl-4 w-[500px] border-l">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
                <div className="overflow-hidden relative bg-gray-100 rounded-lg border aspect-square">
                  <Image
                    src={selectedImage}
                    alt={selectedImageData?.name || "Preview"}
                    fill
                    className="object-contain"
                    sizes="320px"
                  />
                </div>
              </div>

              {/* Image Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Details</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">File name:</span>
                    <p className="font-mono text-xs break-all">
                      {selectedImageData?.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">URL:</span>
                    <p className="font-mono text-xs break-all">
                      {selectedImage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedImage}>
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
