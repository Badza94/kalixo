"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { LayoutTemplate } from "@workspace/ui/lucide-react";
import templatesData from "../data/templates.json";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelectorDialog({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplateSelectorDialogProps) {
  const templates = templatesData.templates as Template[];

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
          <DialogDescription>
            Choose a template to get started quickly. You can customize it
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="flex flex-col h-full transition-all cursor-pointer hover:shadow-lg hover:border-primary/50"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex justify-center items-center mb-2">
                  <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-primary/10">
                    <LayoutTemplate className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">{template.name}</CardTitle>
                <CardDescription className="text-center">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-end">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
