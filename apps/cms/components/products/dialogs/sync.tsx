/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";

// Helper function to detect changes between objects
const findChangedFields = (
  original: any,
  modified: any
): Record<string, { original: any; modified: any }> => {
  const changedFields: Record<string, { original: any; modified: any }> = {};

  // Find all keys in both objects
  const allKeys = new Set([
    ...Object.keys(original || {}),
    ...Object.keys(modified || {}),
  ]);

  // Check each key for differences
  allKeys.forEach((key) => {
    // Skip if key doesn't exist in one of the objects
    if (
      !original ||
      !modified ||
      !Object.hasOwn(original, key) ||
      !Object.hasOwn(modified, key)
    )
      return;

    // Check for differences
    if (JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
      changedFields[key] = {
        original: original[key],
        modified: modified[key],
      };
    }
  });

  return changedFields;
};

function ProductSyncDialog({
  open,
  onOpenChange,
  originalProduct,
  modifiedProduct,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalProduct: any;
  modifiedProduct: any;
}) {
  const t = useTranslations("Products.Sync");
  const at = useTranslations("Products.AI");
  const ct = useTranslations("Common");
  // Calculate the differences between the objects
  const changedFields = useMemo(
    () => findChangedFields(originalProduct, modifiedProduct),
    [originalProduct, modifiedProduct]
  );

  // Check if there are any changes to display
  const hasChanges = Object.keys(changedFields).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-auto">
          <div className="p-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {t("title")}:{" "}
                    {modifiedProduct?.title || originalProduct?.title}
                  </CardTitle>
                  <Button
                    onClick={() => {
                      onOpenChange(false);
                    }}
                  >
                    {ct("accept")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="table-fixed w-full overflow-x-auto whitespace-normal">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{at("attribute")}</TableHead>
                      <TableHead>{at("currentData")}</TableHead>
                      <TableHead>{at("providedData")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hasChanges ? (
                      Object.entries(changedFields).map(
                        ([key, { original, modified }]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </TableCell>
                            <TableCell>{original}</TableCell>
                            <TableCell className="text-primary">
                              {modified}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          {t("noChanges")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ProductSyncDialog;
