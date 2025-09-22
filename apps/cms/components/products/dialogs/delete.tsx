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
import { TProductType } from "../tables/product-type";
import { useTranslations } from "next-intl";

function DeleteDialog({
  open,
  onOpenChange,
  handleDelete,
  handleCancel,
  productType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productType?: TProductType;
  handleDelete?: () => void;
  handleCancel?: () => void;
}) {
  const ct = useTranslations("Common");
  const t = useTranslations("Products.Attributes.ProductTypes");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border shadow-lg max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{ct("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("permanentlyDelete", {
              name: productType?.name as string,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {ct("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {ct("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDialog;
