"use client";

import { useEffect, useMemo, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { FilePlus, FileEdit } from "@workspace/ui/lucide-react";
import templatesData from "../data/templates.json";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

interface NewPageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: { name: string; path: string; templateId?: string }) => void | Promise<void>;
  existingPaths?: string[];
}

type DialogStep = "choose" | "create" | "edit";

export function NewPageDialog({
  isOpen,
  onClose,
  onCreate,
  existingPaths = [],
}: NewPageDialogProps) {
  const [step, setStep] = useState<DialogStep>("choose");
  const [pageName, setPageName] = useState("");
  const [path, setPath] = useState("");
  const [pathTouched, setPathTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExistingPath, setSelectedExistingPath] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const normalisedExistingPaths = useMemo(
    () => new Set(existingPaths.map((value) => value.toLowerCase())),
    [existingPaths]
  );

  useEffect(() => {
    if (!isOpen) {
      setStep("choose");
      setPageName("");
      setPath("");
      setPathTouched(false);
      setError(null);
      setIsSubmitting(false);
      setSelectedExistingPath("");
      setSelectedTemplate("");
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!pathTouched && step === "create") {
      const slug = slugify(pageName);
      if (!slug) {
        setPath("/");
        return;
      }
      setPath(`/${slug}`);
    }
  }, [pageName, pathTouched, step]);

  const validate = () => {
    if (!pageName.trim()) {
      setError("Page name is required.");
      return false;
    }

    if (!path.trim()) {
      setError("Path is required.");
      return false;
    }

    if (!path.startsWith("/")) {
      setError("Path must start with a forward slash (/)");
      return false;
    }

    if (normalisedExistingPaths.has(path.toLowerCase())) {
      setError("A page with this path already exists.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreate({
        name: pageName.trim(),
        path,
        templateId: selectedTemplate || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPathTouched(true);
    setPath(event.target.value);
  };

  const handleEditExisting = () => {
    if (!selectedExistingPath) {
      setError("Please select a page to edit.");
      return;
    }

    setIsSubmitting(true);
    const editPath = selectedExistingPath.endsWith("/edit")
      ? selectedExistingPath
      : `${selectedExistingPath}/edit`;

    // Navigate directly
    window.location.href = editPath;
  };

  const handleBack = () => {
    setStep("choose");
    setError(null);
  };

  // Step 1: Choose between create or edit
  if (step === "choose") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Page Manager</DialogTitle>
            <DialogDescription>
              Create a new page or edit an existing one
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <Card
              className="flex flex-col h-full border-2 transition-all cursor-pointer hover:shadow-lg hover:border-primary/50"
              onClick={() => setStep("create")}
            >
              <CardHeader>
                <div className="flex justify-center items-center mb-2">
                  <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-primary/10">
                    <FilePlus className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Create New Page</CardTitle>
                <CardDescription className="text-center">
                  Start fresh with a new page
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-end">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStep("create");
                  }}
                >
                  Create Page
                </Button>
              </CardContent>
            </Card>

            <Card
              className="flex flex-col h-full border-2 transition-all cursor-pointer hover:shadow-lg hover:border-primary/50"
              onClick={() => setStep("edit")}
            >
              <CardHeader>
                <div className="flex justify-center items-center mb-2">
                  <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-primary/10">
                    <FileEdit className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">
                  Edit Existing Page
                </CardTitle>
                <CardDescription className="text-center">
                  Continue working on a page you&apos;ve already created
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-end">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStep("edit");
                  }}
                >
                  Select Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 2a: Create new page
  if (step === "create") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Set the name and path for your new page
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="page-name">Page name</Label>
              <Input
                id="page-name"
                value={pageName}
                onChange={(event) => setPageName(event.target.value)}
                placeholder="e.g. Xbox Gift Cards"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-path">Path</Label>
              <Input
                id="page-path"
                value={path}
                onChange={handlePathChange}
                placeholder="/xbox-gift-cards"
              />
              <p className="text-xs text-muted-foreground">
                The path determines where this page lives on your storefront.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-template">Template (Optional)</Label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger id="page-template" className="w-full">
                  <SelectValue placeholder="Choose a template (optional)..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None - Start from scratch</SelectItem>
                  {(templatesData.templates as Array<{ id: string; name: string }>).map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a template to pre-populate your page with content.
              </p>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Redirecting..." : "Create & Edit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 2b: Edit existing page
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Existing Page</DialogTitle>
          <DialogDescription>
            Select a page from the list below to continue editing
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="existing-page">Select page</Label>
            <Select
              value={selectedExistingPath}
              onValueChange={setSelectedExistingPath}
            >
              <SelectTrigger id="existing-page" className="w-full">
                <SelectValue placeholder="Choose a page..." />
              </SelectTrigger>
              <SelectContent>
                {existingPaths.filter((path) => path !== "_templates").length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    No pages found
                  </SelectItem>
                ) : (
                  existingPaths
                    .filter((path) => path !== "_templates")
                    .map((pagePath) => (
                      <SelectItem key={pagePath} value={pagePath}>
                        {pagePath}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            onClick={handleEditExisting}
            disabled={!selectedExistingPath || isSubmitting}
          >
            {isSubmitting ? "Opening..." : "Edit Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
