"use client";

import React, { useRef, useEffect, useState } from "react";
import { registerOverlayPortal } from "@measured/puck";

interface ResizableSlotFieldProps {
  value: Array<{
    content: React.ReactNode | (() => React.ReactNode);
    width?: string;
  }>;
  onChange: (
    value: Array<{
      content: React.ReactNode | (() => React.ReactNode);
      width?: string;
    }>
  ) => void;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
}

export function ResizableSlotField({
  value = [],
  onChange,
  direction = "row",
}: ResizableSlotFieldProps) {
  const resizeHandleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Register resize handles as overlay portals
  useEffect(() => {
    resizeHandleRefs.current.forEach((ref) => {
      if (ref) {
        registerOverlayPortal(ref);
      }
    });
  }, [value.length]);

  const handleResize = (index: number, newWidth: string) => {
    const newValue = [...value];
    newValue[index] = {
      ...newValue[index],
      width: newWidth,
    };
    onChange(newValue);
  };

  const renderItems = () => {
    if (!value || value.length === 0) {
      return (
        <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No items</span>
        </div>
      );
    }

    return value.map((item, index) => {
      const content =
        typeof item.content === "function" ? item.content() : item.content;

      return (
        <ResizableItem
          key={index}
          index={index}
          content={content}
          width={item.width}
          direction={direction}
          onWidthChange={(newWidth) => handleResize(index, newWidth)}
          resizeHandleRef={(ref) => {
            resizeHandleRefs.current[index] = ref;
          }}
        />
      );
    });
  };

  return <div className="resizable-slot-field">{renderItems()}</div>;
}

interface ResizableItemProps {
  index: number;
  content: React.ReactNode;
  width?: string;
  direction: "row" | "column" | "row-reverse" | "column-reverse";
  onWidthChange: (width: string) => void;
  resizeHandleRef: (ref: HTMLDivElement | null) => void;
}

function ResizableItem({
  index,
  content,
  width = "auto",
  direction,
  onWidthChange,
  resizeHandleRef,
}: ResizableItemProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const itemRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    setCurrentWidth(width);
  }, [width]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!itemRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = itemRef.current.offsetWidth;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !itemRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const newWidth = startWidthRef.current + deltaX;

    // Convert to percentage
    const containerWidth = itemRef.current.parentElement?.offsetWidth || 1;
    const percentage = Math.max(
      10,
      Math.min(90, (newWidth / containerWidth) * 100)
    );

    const newWidthValue = `${percentage.toFixed(1)}%`;
    setCurrentWidth(newWidthValue);
    onWidthChange(newWidthValue);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const isRowDirection = direction === "row" || direction === "row-reverse";

  const itemStyle: React.CSSProperties = {
    width: currentWidth,
    position: "relative",
    minWidth: "50px",
  };

  const resizeHandleStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: isRowDirection ? "-4px" : "0",
    bottom: 0,
    width: isRowDirection ? "8px" : "100%",
    height: isRowDirection ? "100%" : "8px",
    cursor: isRowDirection ? "col-resize" : "row-resize",
    backgroundColor: isResizing
      ? "#3b82f6"
      : isHovered
        ? "rgba(59, 130, 246, 0.1)"
        : "transparent",
    zIndex: 10,
    transition: "background-color 0.2s ease",
  };

  return (
    <div
      ref={itemRef}
      style={itemStyle}
      className="resizable-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content || (
        <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Drop components here</span>
        </div>
      )}
      <div
        ref={resizeHandleRef}
        style={resizeHandleStyle}
        onMouseDown={handleMouseDown}
        className={`resize-handle ${isResizing ? "resizing" : ""}`}
      />
    </div>
  );
}
