"use client";

export interface SpacerBlockProps {
  height?: string;
  width?: string;
  className?: string;
}

export function SpacerBlock({
  height = "24px",
  width = "100%",
  className = "",
}: SpacerBlockProps) {
  return (
    <div
      className={className}
      style={{
        height,
        width,
        minHeight: height,
      }}
      aria-hidden="true"
    />
  );
}
