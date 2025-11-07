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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { toast } from "sonner";

interface GlobalComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  position: "header" | "footer";
}

interface PageSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentExcludedIds: string[];
  onSave: (excludedIds: string[]) => void;
}

export function PageSettingsDialog({
  isOpen,
  onClose,
  currentExcludedIds,
  onSave,
}: PageSettingsDialogProps) {
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [globals, setGlobals] = useState<{
    header: GlobalComponent[];
    footer: GlobalComponent[];
  }>({ header: [], footer: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setExcludedIds(new Set(currentExcludedIds));
      setIsLoading(true);

      fetch("/puck/api/globals")
        .then((res) => res.json())
        .then((data) => {
          if (data.globals) {
            setGlobals({
              header: data.globals.header || [],
              footer: data.globals.footer || [],
            });
          }
        })
        .catch((err) => console.error("Failed to load globals:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, currentExcludedIds]);

  const handleToggle = (componentId: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(componentId)) {
        next.delete(componentId);
      } else {
        next.add(componentId);
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(Array.from(excludedIds));
    toast.success("Page settings saved!");
    onClose();
  };

  const allGlobals = [...globals.header, ...globals.footer];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
          <DialogDescription>
            Control which global components appear on this page
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : allGlobals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No global components configured yet. Use the &quot;Globals&quot;
              button to set them up.
            </p>
          ) : (
            <>
              <Label className="text-base font-semibold">
                Hide Global Components
              </Label>
              <div className="pl-4 space-y-2">
                {allGlobals.map((component) => (
                  <div
                    key={component.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`exclude-${component.id}`}
                      checked={excludedIds.has(component.id)}
                      onCheckedChange={() => handleToggle(component.id)}
                    />
                    <label
                      htmlFor={`exclude-${component.id}`}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {component.type} ({component.position}) -{" "}
                      {component.id.slice(0, 20)}...
                    </label>
                  </div>
                ))}
              </div>
              <p className="pt-2 text-xs text-muted-foreground">
                Checked components will NOT appear on this page.
              </p>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
