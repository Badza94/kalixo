"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";

export interface SocialButtonBlockProps {
  provider: "google" | "facebook" | "x";
  text?: string;
  borderRadius?: string;
  className?: string;
  onClick?: () => void;
}

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z"
      fill="#4285F4"
    />
    <path
      d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z"
      fill="#34A853"
    />
    <path
      d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.82999 3.96409 7.28999V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
      fill="#FBBC05"
    />
    <path
      d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29115 17.2154 7.59375 17.8907V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.93742 3.51562 10.9932 3.51562C11.9776 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.60001 10.4062 7.3125V9H12.9023L12.5033 11.6016H10.4062V17.8907C14.7088 17.2154 18 13.4922 18 9Z"
      fill="#1877F2"
    />
  </svg>
);

const XIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.7002 7.61159L16.3054 1H15.0051L10.0619 6.69747L6.12696 1H1L6.88194 9.98883L1 17H2.30028L7.51985 11.0075L11.6729 17H16.7999L10.6998 7.61159H10.7002ZM8.21667 10.1984L7.58792 9.30522L2.79972 2.0497H5.43753L9.20597 8.03092L9.83471 8.92408L15.0057 16.0002H12.3679L8.21667 10.1988V10.1984Z" />
  </svg>
);

export function SocialButtonBlock({
  provider,
  text,
  borderRadius = "6px",
  className = "",
  onClick,
}: SocialButtonBlockProps) {
  const providerConfig = {
    google: {
      icon: <GoogleIcon />,
      defaultText: "Continue with Google",
      bgColor: "bg-white",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
      hoverBg: "hover:bg-gray-50",
    },
    facebook: {
      icon: <FacebookIcon />,
      defaultText: "Continue with Facebook",
      bgColor: "bg-[#1877F2]",
      textColor: "text-white",
      borderColor: "border-[#1877F2]",
      hoverBg: "hover:bg-[#166FE5]",
    },
    x: {
      icon: <XIcon />,
      defaultText: "Continue with X",
      bgColor: "bg-black",
      textColor: "text-white",
      borderColor: "border-black",
      hoverBg: "hover:bg-gray-900",
    },
  };

  const config = providerConfig[provider];
  const displayText = text || config.defaultText;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-3 w-full px-4 py-2 border font-medium transition-colors",
        config.bgColor,
        config.textColor,
        config.borderColor,
        config.hoverBg,
        className
      )}
      style={{ borderRadius }}
    >
      <span className="flex-shrink-0">{config.icon}</span>
      <span>{displayText}</span>
    </button>
  );
}
