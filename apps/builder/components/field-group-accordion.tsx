"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui/components/accordion";
import {
  Type,
  Palette,
  Image,
  Square,
  Sparkles,
  Move,
  Maximize,
  LayoutGrid,
  AlignCenter,
  Code2,
} from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// Icon mapping for field groups
const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  typography: Type,
  colors: Palette,
  background: Image,
  border: Square,
  effects: Sparkles,
  spacing: Move,
  sizing: Maximize,
  layout: LayoutGrid,
  alignment: AlignCenter,
  structure: LayoutGrid,
  custom: Code2,
};

interface FieldGroup {
  key: string;
  label: string;
  fields: string[];
}

interface FieldGroupAccordionProps {
  groups: FieldGroup[];
  children: React.ReactNode;
  defaultExpanded?: string[];
  className?: string;
}

/**
 * FieldGroupAccordion - Groups fields in collapsible accordions
 * Similar to Elementor's field organization
 */
export function FieldGroupAccordion({
  groups,
  children,
  defaultExpanded = [],
  className,
}: FieldGroupAccordionProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultExpanded}
      className={cn("w-full", className)}
    >
      {groups.map((group) => {
        const Icon = GROUP_ICONS[group.key] || Square;

        return (
          <AccordionItem key={group.key} value={group.key}>
            <AccordionTrigger className="py-2 px-1 hover:no-underline">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {group.label}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-3">
              <div className="space-y-3" data-field-group={group.key}>
                {children}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

/**
 * Single collapsible field group
 */
interface SingleFieldGroupProps {
  groupKey: string;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function SingleFieldGroup({
  groupKey,
  label,
  children,
  defaultOpen = true,
  className,
}: SingleFieldGroupProps) {
  const Icon = GROUP_ICONS[groupKey] || Square;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? groupKey : undefined}
      className={cn("w-full", className)}
    >
      <AccordionItem value={groupKey} className="border rounded-md">
        <AccordionTrigger className="py-2 px-3 hover:no-underline hover:bg-muted/50 rounded-t-md">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {label}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3 pt-2">
          <div className="space-y-3" data-field-group={groupKey}>
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/**
 * Simple field section header (non-collapsible)
 */
interface FieldSectionProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

export function FieldSection({
  label,
  icon: Icon,
  children,
  className,
}: FieldSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 pb-1 border-b">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
