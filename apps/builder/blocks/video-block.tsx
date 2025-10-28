"use client";

import { AspectRatio } from "@workspace/ui/components/aspect-ratio";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface VideoBlockProps {
  src: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9" | "custom" | "auto";
  customAspectRatio?: string;
  maxWidth?: string;
  borderRadius?: {
    size:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "none"
      | "full"
      | "custom";
    customValue?: string;
  };
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  margin?: SpacingValue;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
}

export function VideoBlock({
  src,
  aspectRatio = "16/9",
  customAspectRatio,
  maxWidth = "100%",
  borderRadius,
  shadow = "none",
  margin,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  className = "",
}: VideoBlockProps) {
  // Build margin
  const buildMargin = (spacing?: SpacingValue) => {
    if (!spacing) return {};
    if (spacing.all) {
      return { margin: spacing.all };
    }
    return {
      marginTop: spacing.top || "0",
      marginRight: spacing.right || "0",
      marginBottom: spacing.bottom || "0",
      marginLeft: spacing.left || "0",
    };
  };

  // Resolve border radius
  const borderRadiusMap = {
    none: "0",
    xs: "2px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "24px",
    "4xl": "32px",
    full: "9999px",
  };

  const resolvedBorderRadius = borderRadius
    ? borderRadius.size === "custom" && borderRadius.customValue
      ? borderRadius.customValue
      : borderRadius.size !== "custom"
        ? borderRadiusMap[borderRadius.size]
        : undefined
    : undefined;

  // Resolve aspect ratio
  const aspectRatioMap = {
    "16/9": 16 / 9,
    "4/3": 4 / 3,
    "1/1": 1,
    "21/9": 21 / 9,
    auto: undefined,
  };

  const resolvedAspectRatio =
    aspectRatio === "custom" && customAspectRatio
      ? parseFloat(customAspectRatio)
      : aspectRatio !== "custom" && aspectRatio !== "auto"
        ? aspectRatioMap[aspectRatio]
        : undefined;

  const containerStyles: React.CSSProperties = {
    ...buildMargin(margin),
    maxWidth,
    width: "100%",
  };

  const videoWrapperStyles: React.CSSProperties = {
    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    ...(shadow &&
      shadow !== "none" && {
        boxShadow:
          shadow === "sm"
            ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            : shadow === "md"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              : shadow === "lg"
                ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                : shadow === "xl"
                  ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                  : "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      }),
    overflow: "hidden",
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (id: string) => {
    const params = new URLSearchParams({
      ...(autoplay && { autoplay: "1" }),
      ...(loop && { loop: "1", playlist: id }),
      ...(muted && { mute: "1" }),
      ...(!controls && { controls: "0" }),
    });
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  };

  // Get Vimeo embed URL
  const getVimeoEmbedUrl = (id: string) => {
    const params = new URLSearchParams({
      ...(autoplay && { autoplay: "1" }),
      ...(loop && { loop: "1" }),
      ...(muted && { muted: "1" }),
    });
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  };

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Extract Vimeo ID from URL
  const extractVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Detect video type from URL
  const detectVideoType = (url: string): "youtube" | "vimeo" | "direct" => {
    if (!url || url.trim() === "") return "direct";

    // Check if it's a YouTube URL
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      extractYouTubeId(url)
    ) {
      return "youtube";
    }

    // Check if it's a Vimeo URL
    if (url.includes("vimeo.com") || extractVimeoId(url)) {
      return "vimeo";
    }

    // Otherwise, treat as direct video URL
    return "direct";
  };

  // Render the appropriate video type
  const renderVideo = () => {
    // Show placeholder if no src is provided
    if (!src || src.trim() === "") {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px] bg-muted rounded">
          <div className="p-4 text-center">
            <svg
              className="mx-auto mb-2 w-12 h-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-muted-foreground">
              Upload a video or enter a YouTube/Vimeo URL
            </p>
          </div>
        </div>
      );
    }

    const videoType = detectVideoType(src);

    // YouTube video
    if (videoType === "youtube") {
      const videoId = extractYouTubeId(src);
      if (!videoId) {
        return (
          <div className="flex items-center justify-center h-full min-h-[200px] bg-muted rounded">
            <div className="p-4 text-center">
              <svg
                className="mx-auto mb-2 w-12 h-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">
                Invalid YouTube URL
              </p>
            </div>
          </div>
        );
      }
      return (
        <iframe
          src={getYouTubeEmbedUrl(videoId)}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      );
    }

    // Vimeo video
    if (videoType === "vimeo") {
      const videoId = extractVimeoId(src);
      if (!videoId) {
        return (
          <div className="flex items-center justify-center h-full min-h-[200px] bg-muted rounded">
            <div className="p-4 text-center">
              <svg
                className="mx-auto mb-2 w-12 h-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">Invalid Vimeo URL</p>
            </div>
          </div>
        );
      }
      return (
        <iframe
          src={getVimeoEmbedUrl(videoId)}
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      );
    }

    // Direct video URL or uploaded file
    return (
      <video
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    );
  };

  const content = renderVideo();

  // Use AspectRatio if specified
  if (resolvedAspectRatio !== undefined) {
    return (
      <div style={containerStyles} className={className}>
        <AspectRatio
          ratio={resolvedAspectRatio as number}
          style={videoWrapperStyles}
        >
          {content}
        </AspectRatio>
      </div>
    );
  }

  // Without aspect ratio
  return (
    <div style={containerStyles} className={className}>
      <div
        style={{
          ...videoWrapperStyles,
          position: "relative",
          minHeight: "400px",
        }}
      >
        {content}
      </div>
    </div>
  );
}
