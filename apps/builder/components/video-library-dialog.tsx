"use client";

import { useState, useEffect, useRef } from "react";
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

interface VideoLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
}

export function VideoLibraryDialog({
  isOpen,
  onClose,
  onSelect,
  currentValue,
}: VideoLibraryDialogProps) {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(
    currentValue || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/media?type=video");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      toast.error("Failed to load video library");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

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
        toast.success("Video uploaded successfully!");

        // Refresh the list
        await fetchVideos();

        // Auto-select the newly uploaded video
        setSelectedVideo(data.url);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelect = () => {
    if (selectedVideo) {
      onSelect(selectedVideo);
      onClose();
    }
  };

  const selectedVideoData = videos.find((video) => video.url === selectedVideo);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Video Library</DialogTitle>
          <DialogDescription>
            Select a video from your library or upload a new one
          </DialogDescription>
        </DialogHeader>

        {/* Upload Button */}
        <div className="flex gap-2 pb-4 border-b">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
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
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>

        {/* Main Content: Grid + Preview */}
        <div className="flex flex-1 gap-4 min-h-0">
          {/* Videos Grid */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading videos...</div>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-gray-500">
                  <p className="mb-2">No videos in your library</p>
                  <p className="text-sm">
                    Upload your first video to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 p-2">
                {videos.map((video) => (
                  <button
                    key={video.url}
                    onClick={() => setSelectedVideo(video.url)}
                    className={`relative aspect-video rounded-lg border-2 overflow-hidden transition-all hover:border-blue-400 ${
                      selectedVideo === video.url
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    {selectedVideo === video.url && (
                      <div className="absolute top-2 right-2 p-1 text-white bg-blue-500 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute right-0 bottom-0 left-0 p-1 text-xs text-white truncate bg-black/60">
                      {video.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {selectedVideo && (
            <div className="flex flex-col gap-4 pl-4 w-[500px] border-l">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
                <div className="overflow-hidden relative bg-gray-100 rounded-lg border aspect-video">
                  <video
                    src={selectedVideo}
                    className="w-full h-full object-contain"
                    controls
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Video Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Details</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">File name:</span>
                    <p className="font-mono text-xs break-all">
                      {selectedVideoData?.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">URL:</span>
                    <p className="font-mono text-xs break-all">
                      {selectedVideo}
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
          <Button onClick={handleSelect} disabled={!selectedVideo}>
            Select Video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
