"use client";

import { useState, useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { AutoField } from "@puckeditor/core";
import type { Field } from "@puckeditor/core";
import { organizeFieldsIntoGroups } from "../lib/field-categorizer";

interface FieldsWithTabsProps {
  fields: Record<string, Field>;
  name: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  readOnly?: boolean;
}

export function FieldsWithTabs({
  fields,
  name,
  data,
  onChange,
  readOnly = false,
}: FieldsWithTabsProps) {
  const [activeTab, setActiveTab] = useState("content");

  // Organize fields into content, style, and advanced groups
  const {
    content: contentFields,
    style: styleFields,
    advanced: advancedFields,
  } = useMemo(() => organizeFieldsIntoGroups(fields), [fields]);

  const hasContentFields = Object.keys(contentFields).length > 0;
  const hasStyleFields = Object.keys(styleFields).length > 0;
  const hasAdvancedFields = Object.keys(advancedFields).length > 0;

  // If no fields, return null
  if (!hasContentFields && !hasStyleFields && !hasAdvancedFields) {
    return null;
  }

  // Render field helper
  const renderField = (fieldName: string, field: Field) => (
    <AutoField
      key={fieldName}
      name={fieldName}
      field={field}
      value={data[fieldName]}
      onChange={(value) => {
        onChange({ ...data, [fieldName]: value });
      }}
      readOnly={readOnly}
    />
  );

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full h-9">
          <TabsTrigger value="content" className="text-xs">
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            Style
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">
            Advanced
          </TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-0 space-y-4">
          {hasContentFields ? (
            Object.entries(contentFields).map(([fieldName, field]) =>
              renderField(fieldName, field)
            )
          ) : (
            <p className="py-4 text-sm text-center text-muted-foreground">
              No content fields
            </p>
          )}
        </TabsContent>
        <TabsContent value="style" className="mt-0 space-y-4">
          {hasStyleFields ? (
            Object.entries(styleFields).map(([fieldName, field]) =>
              renderField(fieldName, field)
            )
          ) : (
            <p className="py-4 text-sm text-center text-muted-foreground">
              No style fields
            </p>
          )}
        </TabsContent>
        <TabsContent value="advanced" className="mt-0 space-y-4">
          {hasAdvancedFields ? (
            Object.entries(advancedFields).map(([fieldName, field]) =>
              renderField(fieldName, field)
            )
          ) : (
            <p className="py-4 text-sm text-center text-muted-foreground">
              No advanced fields
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
