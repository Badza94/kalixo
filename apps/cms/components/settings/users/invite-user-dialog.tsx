"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import companies from "@/data/companies.json";
import { toast } from "@workspace/ui/sonner";
import { useTranslations } from "next-intl";
import { Plus } from "@workspace/ui/lucide-react";
import { useState } from "react";

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export function InviteUserDialog() {
  const td = useTranslations("Settings.Users.inviteUserDialog");
  const tf = useTranslations("Settings.Users.filters");
  const t = useTranslations("Settings.Users");

  const [open, setOpen] = useState(false);

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      role: "",
    },
  });

  function onSubmit(values: InviteUserFormValues) {
    // TODO: handle submit
    console.log(values);
    toast.success(td("invitationSent"));
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          {t("inviteUser")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{td("title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={td("emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={td("firstNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={td("lastNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("company")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={td("selectCompany")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies
                        .slice(0, 10)
                        .map((company: { id: string; companyName: string }) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td("role")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={td("selectRole")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="superAdministrator">
                        {tf("types.superAdministrator")}
                      </SelectItem>
                      <SelectItem value="administrator">
                        {tf("types.administrator")}
                      </SelectItem>
                      <SelectItem value="channelAdmin">
                        {tf("types.channelAdmin")}
                      </SelectItem>
                      <SelectItem value="adminView">
                        {tf("types.adminView")}
                      </SelectItem>
                      <SelectItem value="companyAdmin">
                        {tf("types.companyAdmin")}
                      </SelectItem>
                      <SelectItem value="companyChannelAdmin">
                        {tf("types.companyChannelAdmin")}
                      </SelectItem>
                      <SelectItem value="partner">
                        {tf("types.partner")}
                      </SelectItem>
                      <SelectItem value="vendor">
                        {tf("types.vendor")}
                      </SelectItem>
                      <SelectItem value="agency">
                        {tf("types.agency")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{td("sendInvitation")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
