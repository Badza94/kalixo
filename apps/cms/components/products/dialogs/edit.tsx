import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";

interface EditDialogProps {
  open: boolean; // Optional prop to control dialog open state
  setOpen: (open: boolean) => void; // Optional function to set dialog open state
  title: string; // Title of the dialog
  description: string; // Description of the dialog
  children: React.ReactNode; // Children elements to be rendered inside the dialog
}

function EditDialog({
  children,
  open,
  setOpen,
  title,
  description,
}: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
