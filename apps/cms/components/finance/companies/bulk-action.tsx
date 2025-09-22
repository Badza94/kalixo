/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useForm, type Resolver } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

type SelectedCompany = {
  id: string;
  companyName: string;
};

function BulkCompanyActionDialog({
  selectedData,
}: {
  selectedData: SelectedCompany[];
}) {
  const [open, setOpen] = useState(false);
  const bt = useTranslations("BulkAction");
  const t = useTranslations("Finance.Companies");
  const st = useTranslations("Status");
  const ct = useTranslations("Common");

  const STATUS_OPTIONS = [
    { value: "approved", label: st("approved") },
    { value: "pending", label: st("pending") },
    { value: "rejected", label: st("rejected") },
    { value: "suspended", label: st("suspended") },
    { value: "under_review", label: st("under_review") },
  ];

  const formSchema = z.object({
    status: z.string().min(1, { message: st("required") }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues, any>,
  });

  const onSubmit = (data: FormValues) => {
    console.log("data: ", data);
    console.log(
      "Affected company IDs:",
      selectedData.map((company) => company.id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline">{bt("bulkActions")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bt("Companies.title")}</DialogTitle>
          <DialogDescription>
            {bt("Companies.description", { count: selectedData.length })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>{t("title")}:</p>
          <ScrollArea className="h-[200px]">
            <ul className="list-disc pl-4 space-y-2 mb-4">
              {selectedData.map((company) => (
                <li className="text-muted-foreground text-sm" key={company.id}>
                  {company.companyName}
                </li>
              ))}
            </ul>
          </ScrollArea>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ct("newStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={ct("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {st(status.value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {st("update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BulkCompanyActionDialog;
