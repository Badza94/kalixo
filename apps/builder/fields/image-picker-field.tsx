"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaLibraryDialog } from "../components/media-library-dialog";
import { Image as ImageIcon } from "@workspace/ui/lucide-react";
import { SharedAssets } from "@workspace/ui/assets";

interface ImagePickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImagePickerField({
  value = "",
  onChange,
  label = "Image",
}: ImagePickerFieldProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageSelect = (url: string) => {
    onChange(url);
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;

    // Check if it's a data URL
    if (url.startsWith("data:image")) return true;

    // Check if it's an absolute URL (http/https)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }

    // Check if it looks like a path (starts with /)
    if (url.startsWith("/")) return true;

    return false;
  };

  const imageSrc =
    value && isValidImageUrl(value) ? value : SharedAssets.placeholder;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Current Image Preview */}
      <div className="overflow-hidden relative w-full bg-gray-100 rounded-lg border aspect-video">
        <Image
          src={imageSrc}
          alt={value ? "Selected image" : "Placeholder image"}
          fill
          className="object-cover"
          sizes="400px"
          onError={(e) => {
            // Fallback to placeholder on error
            const target = e.target as HTMLImageElement;
            if (target.src !== SharedAssets.placeholder) {
              target.src = SharedAssets.placeholder;
            }
          }}
        />
      </div>

      {/* URL Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or click 'Browse Library'"
        className="px-3 py-2 w-full text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Browse Library Button */}
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="flex gap-2 justify-center items-center px-4 py-2 w-full text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
      >
        <ImageIcon className="w-4 h-4" />
        Browse Library
      </button>

      {/* Media Library Dialog */}
      <MediaLibraryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelect={handleImageSelect}
        currentValue={value}
      />
    </div>
  );
}
