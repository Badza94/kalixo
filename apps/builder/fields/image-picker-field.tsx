"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaLibraryDialog } from "../components/media-library-dialog";
import { Image as ImageIcon } from "@workspace/ui/lucide-react";

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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Current Image Preview */}
      {value && (
        <div className="relative w-full aspect-video rounded-lg border overflow-hidden bg-gray-100">
          <Image
            src={value}
            alt="Selected image"
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
      )}

      {/* URL Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL or click 'Browse Library'"
        className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Browse Library Button */}
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
