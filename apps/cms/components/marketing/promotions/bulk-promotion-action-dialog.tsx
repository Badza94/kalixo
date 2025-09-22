"use client";

import { useState } from "react";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@workspace/ui/components/dialog";
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
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";

type PromotionStatus =
  | "active"
  | "scheduled"
  | "paused"
  | "expired"
  | "terminated";

const formSchema = z.object({
  status: z.enum(["active", "scheduled", "paused", "expired", "terminated"], {
    message: "Status is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface BulkPromotionActionDialogProps {
  selectedPromotions: string[];
  onAction?: (promotionIds: string[], newStatus: PromotionStatus) => void;
}

export function BulkPromotionActionDialog({
  selectedPromotions,
  onAction,
}: BulkPromotionActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const t = useTranslations("Common");
  const bt = useTranslations("Marketing.Promotions.bulkActions");
  const st = useTranslations("Marketing.Promotions.status");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: FormData) => {
    setPendingFormData(data);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (!pendingFormData) return;

    // Call the onAction callback if provided
    if (onAction) {
      onAction(selectedPromotions, pendingFormData.status);
    }

    // Show success toast
    toast.success(
      bt("success", {
        count: selectedPromotions.length,
        status: st(pendingFormData.status),
      })
    );

    // Reset and close
    setShowConfirmation(false);
    setOpen(false);
    setPendingFormData(null);
    form.reset();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            form.reset();
            setPendingFormData(null);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            {bt("bulkActions")}
            <Badge className="bg-foreground/10 text-foreground border-foreground/10 ml-2">
              {selectedPromotions.length}
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {bt("title", { count: selectedPromotions.length })}
            </DialogTitle>
            <DialogDescription>{bt("description")}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{bt("newStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={bt("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            {st("active")}
                          </div>
                        </SelectItem>
                        <SelectItem value="scheduled">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            {st("scheduled")}
                          </div>
                        </SelectItem>
                        <SelectItem value="paused">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                            {st("paused")}
                          </div>
                        </SelectItem>
                        <SelectItem value="expired">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            {st("expired")}
                          </div>
                        </SelectItem>
                        <SelectItem value="terminated">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            {st("terminated")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">{bt("updateStatus")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{bt("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingFormData &&
                bt("confirmDescription", {
                  count: selectedPromotions.length,
                  status: st(pendingFormData.status),
                })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                pendingFormData?.status === "terminated"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
