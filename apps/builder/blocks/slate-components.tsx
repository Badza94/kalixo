import React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface ButtonProps {
  active?: boolean;
  onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onClick?: () => void;
  "data-test-id"?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      active,
      onPointerDown,
      onClick,
      "data-test-id": dataTestId,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        data-test-id={dataTestId}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "h-8 w-8 p-0",
          active
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-background hover:bg-accent hover:text-accent-foreground"
        )}
        onPointerDown={onPointerDown}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

interface IconProps {
  children: string;
}

export const Icon = ({ children }: IconProps) => {
  // Simple icon mapping - you can replace with actual icon components
  const iconMap: Record<string, string> = {
    format_bold: "B",
    format_italic: "I",
    format_underlined: "U",
    code: "</>",
    looks_one: "H1",
    looks_two: "H2",
    format_quote: '"',
    format_list_numbered: "1.",
    format_list_bulleted: "•",
    format_align_left: "←",
    format_align_center: "↔",
    format_align_right: "→",
    format_align_justify: "⇔",
  };

  return (
    <span className="text-xs font-bold">{iconMap[children] || children}</span>
  );
};

interface ToolbarProps {
  children: React.ReactNode;
}

export const Toolbar = ({ children }: ToolbarProps) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
      {children}
    </div>
  );
};
