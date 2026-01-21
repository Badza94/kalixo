"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

interface TabsFieldProps {
  contentFields: React.ReactNode;
  styleFields: React.ReactNode;
  advancedFields?: React.ReactNode;
  className?: string;
}

export function TabsField({
  contentFields,
  styleFields,
  advancedFields,
  className,
}: TabsFieldProps) {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-0 space-y-4">
          {contentFields}
        </TabsContent>
        <TabsContent value="style" className="mt-0 space-y-4">
          {styleFields}
        </TabsContent>
        <TabsContent value="advanced" className="mt-0 space-y-4">
          {advancedFields || <p className="text-sm text-muted-foreground">No advanced options</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
