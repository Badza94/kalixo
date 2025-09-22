/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import { toast } from "@workspace/ui/sonner";
import { useTranslations } from "next-intl";

type ProductAction = "activate" | "draft" | "archive" | "delete";

export const BulkProductActionDialog = ({
  selectedData,
  translationKey,
}: {
  selectedData: any[];
  translationKey: string;
}) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ProductAction | "">("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bt = useTranslations("BulkAction");
  const bca = useTranslations(
    `BulkAction.${translationKey}.ConfirmationMessages`
  );
  const ba = useTranslations(`BulkAction.${translationKey}.Actions`);

  const pt = useTranslations(translationKey);
  const ct = useTranslations("Common");

  const confirmationMessages = {
    activate: bca("activate"),
    draft: bca("draft"),
    archive: bca("archive"),
    delete: bca("delete"),
  };

  const handleAction = async () => {
    if (!action || selectedData.length === 0) {
      toast.error(bt(`${translationKey}.errorSelect`));

      return;
    }

    setOpen(false);

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const onSubmit = () => {
    // Handle the action submission logic here
    console.log(`Performing action: ${action} on products:`, selectedData);
    toast.success(
      bt(`${translationKey}.Actions.success`, {
        action: bt(action),
        count: selectedData.length,
      })
    );
    setShowConfirmation(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) setAction("");
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
            {bt("bulkActions")}
            <Badge className="bg-foreground/10 text-foreground border-foreground/1">
              {`${selectedData.length}`}
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {bt("bulkActions")}: {selectedData.length} {pt("title")}
            </DialogTitle>
            <DialogDescription>
              {bt(`${translationKey}.description`)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              value={action}
              onValueChange={(value) => setAction(value as ProductAction)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={bt("selectAnAction")}
                  className="w-full"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">{ba("activate")}</SelectItem>
                <SelectItem value="draft">{bt("saveDraft")}</SelectItem>
                <SelectItem value="archive">{ba("archive")}</SelectItem>
                <SelectItem value="delete">{ba("delete")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-4">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {ct("cancel")}
            </Button>
            <Button type="submit" onClick={handleAction}>
              {ct("proceed")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{bt("confirmAction")}</AlertDialogTitle>
            <AlertDialogDescription>
              {action && confirmationMessages[action as ProductAction]}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              {ct("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              className={
                action === "delete"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {ct("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
