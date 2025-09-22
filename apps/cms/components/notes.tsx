"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
} from "@workspace/ui/lucide-react";
import { TrashIcon } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { formatDistanceToNow } from "@workspace/ui/lib/date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { toast } from "@workspace/ui/sonner";
// import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import AlertConfirmationDialog from "./alert-confirmation-dialog";

type TNotesProps = {
  notes: {
    id: number;
    content: string;
    author: string;
    createdAt: string;
  }[];
  currentUser: any;
  companyId: string;
};

function Notes({ notes, currentUser, companyId }: TNotesProps) {
  const t = useTranslations("Common");
  const ft = useTranslations("Forms");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const noteSchema = z.object({
    content: z.string().min(1, { message: ft("Errors.requiredNote") }),
  });

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof noteSchema>) {
    const noteData = {
      content: values.content,
      currentUser: currentUser.id,
      type: "company",
      id: companyId,
    };

    console.log("Note data:", noteData);
    toast.success("Note added successfully!");

    form.reset();
    setOpen(false);
  }

  function onDelete() {
    console.log("Note deleted!");
    setOpenDelete(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("notes")}</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4" />
                {t("addNote")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addNote")}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your note"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit">{t("addNote")}</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[480px]">
          <div className="flex flex-col gap-4">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <p className="text-muted-foreground">{t("noNotes")}</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col gap-2 bg-input p-4 rounded-lg"
                >
                  <div className="flex justify-end">
                    {/* dropdown menu for edit and delete */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpen(true);
                            form.setValue("content", note.content);
                          }}
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setOpenDelete(true);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p>{note.content}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      {note.author}
                    </p>
                    <Badge variant="secondary">
                      {formatDistanceToNow(new Date(note.createdAt), {
                        addSuffix: true,
                      })}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <AlertConfirmationDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={onDelete}
        title={t("confirmAction")}
        description={t("deleteNote")}
      />
    </Card>
  );
}

export default Notes;
