"use client";

import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "@workspace/ui/lucide-react";
import { SharedAssets } from "@workspace/ui/assets";

interface LinkProps {
  href: string;
  isExternal?: boolean;
  children: React.ReactNode;
  icon?: string; // Icon name from lucide-react
  image?: string; // Image URL
  iconPosition?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export function CustomLink({
  href,
  isExternal = false,
  children,
  icon,
  image,
  iconPosition = "left",
  className = "",
  style,
}: LinkProps) {
  // Get icon component from lucide-react
  const IconComponent = icon
    ? (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  // Check if image URL is valid
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("data:image")) return true;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
    if (url.startsWith("/")) return true;
    return false;
  };

  const imageSrc =
    image && isValidImageUrl(image) ? image : SharedAssets.placeholder;

  const content = (
    <>
      {icon && IconComponent && iconPosition === "left" && (
        <IconComponent className="w-4 h-4" />
      )}
      {image && iconPosition === "left" && (
        <div className="relative w-4 h-4">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-contain"
            sizes="16px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== SharedAssets.placeholder) {
                target.src = SharedAssets.placeholder;
              }
            }}
          />
        </div>
      )}
      <span>{children}</span>
      {icon && IconComponent && iconPosition === "right" && (
        <IconComponent className="w-4 h-4" />
      )}
      {image && iconPosition === "right" && (
        <div className="relative w-4 h-4">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-contain"
            sizes="16px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== SharedAssets.placeholder) {
                target.src = SharedAssets.placeholder;
              }
            }}
          />
        </div>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {content}
    </Link>
  );
}

