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
import { useTranslations } from "next-intl";

function AlertConfirmationDialog({
  open,
  setOpen,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  const ct = useTranslations("Common");
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel onClick={() => setOpen(false)}>
            {ct("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {ct("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertConfirmationDialog;
