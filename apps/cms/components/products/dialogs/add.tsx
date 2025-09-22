import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { PlusIcon } from "@workspace/ui/lucide-react";

function AddDialog({
  actionTitle,
  title,
  description,
  children,
  open,
  setOpen,
}: {
  actionTitle: string;
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean; // Optional prop to control dialog open state
  setOpen: (open: boolean) => void; // Optional function to set dialog open state
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          {actionTitle}
        </Button>
      </DialogTrigger>
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

export default AddDialog;
