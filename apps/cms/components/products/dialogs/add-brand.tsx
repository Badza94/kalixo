/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import BrandForm from "../forms/brand";
import { useState } from "react";
import { PlusIcon } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";

function AddBrandDialog({
  onSuccess,
  onCancel,
}: {
  onSuccess: (data: any) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Products.Attributes.Brands");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("addBrand")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addNewBrandTitle")}</DialogTitle>
          <DialogDescription>{t("addNewBrandDescription")}</DialogDescription>
        </DialogHeader>
        <BrandForm
          onSubmit={onSuccess}
          onCancel={onCancel}
          onOpenChange={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddBrandDialog;
