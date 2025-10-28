"use client";

import { useState } from "react";
import { VideoLibraryDialog } from "../components/video-library-dialog";
import { Video as VideoIcon } from "@workspace/ui/lucide-react";

interface VideoPickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function VideoPickerField({
  value = "",
  onChange,
  label = "Video",
}: VideoPickerFieldProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVideoSelect = (url: string) => {
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Current Video Preview */}
      {value && (
        <div className="relative w-full aspect-video rounded-lg border overflow-hidden bg-gray-100">
          <video
            src={value}
            className="w-full h-full object-contain"
            controls
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* URL Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Video URL or click 'Browse Library'"
        className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Browse Library Button */}
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <VideoIcon className="w-4 h-4" />
        Browse Library
      </button>

      {/* Video Library Dialog */}
      <VideoLibraryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelect={handleVideoSelect}
        currentValue={value}
      />
    </div>
  );
}
