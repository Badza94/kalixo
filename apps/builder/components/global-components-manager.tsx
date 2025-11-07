"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "sonner";
import { Trash2, Plus } from "@workspace/ui/lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface SavedComponent {
  id: string;
  name: string;
  components: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
  createdAt: string;
}

interface GlobalComponentsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageContent: Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
  onSaveTemplate: (
    template: Omit<SavedComponent, "id" | "createdAt">
  ) => Promise<void>;
  onInsertTemplate: (
    components: Array<{
      type: string;
      props: Record<string, unknown>;
    }>
  ) => void;
  onDeleteTemplate: (id: string) => Promise<void>;
}

export function GlobalComponentsManager({
  isOpen,
  onClose,
  currentPageContent,
  onSaveTemplate,
  onInsertTemplate,
  onDeleteTemplate,
}: GlobalComponentsManagerProps) {
  const [mode, setMode] = useState<"browse" | "save">("browse");
  const [templateName, setTemplateName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [savedTemplates, setSavedTemplates] = useState<SavedComponent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved templates
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch("/puck/api/templates")
        .then((res) => res.json())
        .then((data) => {
          if (data.templates) {
            setSavedTemplates(data.templates);
          }
        })
        .catch((err) => console.error("Failed to load templates:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleToggleComponent = (componentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(componentId)) {
        next.delete(componentId);
      } else {
        next.add(componentId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (selectedIds.size === 0) {
      toast.error("Please select at least one component");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedComponents = currentPageContent.filter(
        (c) => c.props.id && selectedIds.has(c.props.id as string)
      );

      await onSaveTemplate({
        name: templateName.trim(),
        components: selectedComponents,
      });

      // Reload templates
      const response = await fetch("/puck/api/templates");
      const data = await response.json();
      if (data.templates) {
        setSavedTemplates(data.templates);
      }

      toast.success(`Template "${templateName}" saved!`);
      setTemplateName("");
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInsert = (template: SavedComponent) => {
    onInsertTemplate(template.components);
    toast.success(`Inserted "${template.name}"`);
    onClose();
  };

  const handleDelete = async (template: SavedComponent) => {
    if (!confirm(`Delete "${template.name}"?`)) {
      return;
    }

    try {
      await onDeleteTemplate(template.id);
      setSavedTemplates((prev) => prev.filter((t) => t.id !== template.id));
      toast.success(`Deleted "${template.name}"`);
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Component Templates</DialogTitle>
          <DialogDescription>
            Save groups of components as reusable templates, then insert them on
            any page
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "browse" ? "default" : "outline"}
            onClick={() => setMode("browse")}
            className="flex-1"
          >
            Browse Templates
          </Button>
          <Button
            variant={mode === "save" ? "default" : "outline"}
            onClick={() => setMode("save")}
            className="flex-1"
          >
            Save New Template
          </Button>
        </div>

        {/* Browse & Insert Templates */}
        {mode === "browse" && (
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <p className="py-8 text-sm text-center text-muted-foreground">
                Loading templates...
              </p>
            ) : savedTemplates.length === 0 ? (
              <div className="py-12 text-center">
                <p className="mb-2 text-muted-foreground">
                  No templates saved yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Switch to the &quot;Save New Template&quot; tab to create one
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {savedTemplates.map((template) => (
                  <Card key={template.id} className="relative">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {template.name}
                      </CardTitle>
                      <CardDescription>
                        {template.components.length} component
                        {template.components.length !== 1 ? "s" : ""}
                        {" • "}
                        {new Date(template.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.components.slice(0, 3).map((comp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded bg-muted"
                          >
                            {comp.type}
                          </span>
                        ))}
                        {template.components.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded bg-muted">
                            +{template.components.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleInsert(template)}
                        >
                          <Plus className="mr-1 w-4 h-4" />
                          Insert
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(template)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save New Template */}
        {mode === "save" && (
          <div className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Footer 1, Header Dark, Product Section"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Components from Current Page</Label>
                <div className="overflow-y-auto p-4 max-h-64 rounded-lg border">
                  {currentPageContent.length === 0 ? (
                    <p className="py-4 text-sm text-center text-muted-foreground">
                      No components on this page yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentPageContent
                        .filter((component) => component.props.id)
                        .map((component, index) => {
                          const componentId = component.props.id as string;

                          // Check if this is a container with items
                          const hasItems =
                            component.props.items &&
                            Array.isArray(component.props.items);
                          const itemCount = hasItems
                            ? (component.props.items as unknown[]).length
                            : 0;

                          return (
                            <div
                              key={componentId || index}
                              className="flex items-start p-2 space-x-2 rounded hover:bg-muted/50"
                            >
                              <Checkbox
                                id={`component-${componentId}`}
                                checked={selectedIds.has(componentId)}
                                onCheckedChange={() =>
                                  handleToggleComponent(componentId)
                                }
                              />
                              <label
                                htmlFor={`component-${componentId}`}
                                className="flex-1 text-sm cursor-pointer"
                              >
                                <div className="font-medium">
                                  {component.type}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {componentId.slice(0, 30)}...
                                  {hasItems && itemCount > 0 ? (
                                    <span className="ml-2 text-primary">
                                      ({itemCount} nested item
                                      {itemCount !== 1 ? "s" : ""})
                                    </span>
                                  ) : null}
                                </div>
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecting a container (like GridBlock, FlexBlock,
                  ContainerBlock) will include all nested components
                  automatically
                </p>
              </div>

              <div className="flex gap-2 items-center p-3 bg-blue-50 rounded-lg dark:bg-blue-950/20">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> Parent containers automatically include
                  their children. You only need to select the top-level
                  component.
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Template"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
