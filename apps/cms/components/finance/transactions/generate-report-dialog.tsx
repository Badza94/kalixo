"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Plus } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";
import { useState } from "react";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";

const formSchema = z.object({
  reportName: z.string().min(1, "Report name is required"),
  reportDescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function GenerateReportDialog() {
  const t = useTranslations("Finance.Transactions");
  const ft = useTranslations("Forms");
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportName: "",
      reportDescription: "",
    },
  });

  const onSubmit = (data: FormData) => {
    toast.success(t("reportGeneratedSuccess", { reportName: data.reportName }));
    setOpen(false);
    form.reset();
    // TODO: Implement actual report generation functionality
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("generateReport")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("generateReportTitle")}</DialogTitle>
          <DialogDescription>
            {t("generateReportDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reportName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("reportNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reportDescription")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("reportDescriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                {ft("cancel")}
              </Button>
              <Button type="submit" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("generateReport")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
