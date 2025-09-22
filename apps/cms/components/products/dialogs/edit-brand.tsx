/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { TBrand } from "../tables/brand";
import BrandForm from "../forms/brand";

function EditBrandDialog({
  onSuccess,
  onCancel,
  open,
  setOpen,
  brand,
}: {
  onSuccess: (data: any) => void;
  onCancel: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  brand?: TBrand | undefined;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit the Brand</DialogTitle>
          <DialogDescription>
            Update the brand details below. You can change the name, logo, and
            icon.
          </DialogDescription>
        </DialogHeader>
        <BrandForm
          onSubmit={onSuccess}
          onCancel={onCancel}
          onOpenChange={setOpen}
          brand={brand}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditBrandDialog;
