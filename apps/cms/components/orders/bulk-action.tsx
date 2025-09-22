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

import { Badge } from "@workspace/ui/components/badge";
import { toast } from "@workspace/ui/sonner";
import { useTranslations } from "next-intl";
import AlertConfirmationDialog from "../alert-confirmation-dialog";

type OrderAction =
  | "paymentStatusPaid"
  | "paymentStatusPending"
  | "paymentStatusFailed"
  | "paymentStatusRefunded"
  | "paymentStatusCancelled"
  | "orderStatusDelivered"
  | "orderStatusCancelled"
  | "orderStatusRefunded"
  | "orderStatusPartiallyCompleted"
  | "orderStatusProcessing";

export const BulkOrderActionDialog = ({
  selectedData,
  translationKey,
}: {
  selectedData: any[];
  translationKey: string;
}) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<OrderAction | "">("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bt = useTranslations("BulkAction");
  const bca = useTranslations(
    `BulkAction.${translationKey}.ConfirmationMessages`
  );
  const ba = useTranslations(`BulkAction.${translationKey}.Actions`);

  const pt = useTranslations(translationKey);
  const ct = useTranslations("Common");

  const confirmationMessages = {
    paymentStatusPaid: bca("paymentStatusPaid"),
    paymentStatusPending: bca("paymentStatusPending"),
    paymentStatusFailed: bca("paymentStatusFailed"),
    paymentStatusRefunded: bca("paymentStatusRefunded"),
    paymentStatusCancelled: bca("paymentStatusCancelled"),
    orderStatusDelivered: bca("orderStatusDelivered"),
    orderStatusCancelled: bca("orderStatusCancelled"),
    orderStatusRefunded: bca("orderStatusRefunded"),
    orderStatusPartiallyCompleted: bca("orderStatusPartiallyCompleted"),
    orderStatusProcessing: bca("orderStatusProcessing"),
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
      bt(`${translationKey}.Statuses.success`, {
        action: ba(action),
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
              onValueChange={(value) => setAction(value as OrderAction)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={bt("selectAnAction")}
                  className="w-full"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paymentStatusPaid">
                  {ba("paymentStatusPaid")}
                </SelectItem>
                <SelectItem value="paymentStatusPending">
                  {ba("paymentStatusPending")}
                </SelectItem>
                <SelectItem value="paymentStatusFailed">
                  {ba("paymentStatusFailed")}
                </SelectItem>
                <SelectItem value="paymentStatusRefunded">
                  {ba("paymentStatusRefunded")}
                </SelectItem>
                <SelectItem value="paymentStatusCancelled">
                  {ba("paymentStatusCancelled")}
                </SelectItem>
                <SelectItem value="orderStatusProcessing">
                  {ba("orderStatusProcessing")}
                </SelectItem>
                <SelectItem value="orderStatusDelivered">
                  {ba("orderStatusDelivered")}
                </SelectItem>
                <SelectItem value="orderStatusCancelled">
                  {ba("orderStatusCancelled")}
                </SelectItem>
                <SelectItem value="orderStatusRefunded">
                  {ba("orderStatusRefunded")}
                </SelectItem>
                <SelectItem value="orderStatusPartiallyCompleted">
                  {ba("orderStatusPartiallyCompleted")}
                </SelectItem>
                <SelectItem value="orderStatusProcessing">
                  {ba("orderStatusProcessing")}
                </SelectItem>
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

      <AlertConfirmationDialog
        open={showConfirmation}
        setOpen={setShowConfirmation}
        onConfirm={onSubmit}
        title={bt("confirmAction")}
        description={
          action && confirmationMessages[action as OrderAction]
            ? confirmationMessages[action as OrderAction]
            : ""
        }
      />
    </>
  );
};
