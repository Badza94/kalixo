"use client";

import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { useTranslations } from "next-intl";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@workspace/ui/lib/utils";
// Define the form schema with Zod
const newRoleSchema = z.object({
  roleName: z
    .string()
    .min(1, "Role name is required")
    .min(3, "Role name must be at least 3 characters")
    .max(50, "Role name must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  type: z.string().min(1, "Role type is required"),
});

type NewRoleFormData = z.infer<typeof newRoleSchema>;

function NewRoleForm() {
  const tTypes = useTranslations("Settings.Roles.roleTypes");
  const tForm = useTranslations("Settings.Roles.newRole");

  const form = useForm<NewRoleFormData>({
    resolver: zodResolver(newRoleSchema),
    defaultValues: {
      roleName: "",
      description: "",
      type: "",
    },
  });

  // Watch form values for live preview
  const watchedValues = form.watch();

  const roleTypes = [
    { value: "admin", label: tTypes("admin") },
    { value: "admin viewer", label: tTypes("admin viewer") },
    { value: "web admin", label: tTypes("web admin") },
    { value: "partner", label: tTypes("partner") },
    { value: "vendor", label: tTypes("vendor") },
    { value: "reseller", label: tTypes("reseller") },
    { value: "agency", label: tTypes("agency") },
    { value: "customer", label: tTypes("customer") },
    { value: "client", label: tTypes("client") },
  ];

  const onSubmit = async (data: NewRoleFormData) => {
    try {
      // TODO: Implement role creation logic
      console.log("Creating role:", data);

      // For now, just log the data
      // In a real implementation, you would:
      // 1. Call API to create the role
      // 2. Redirect to roles list or role detail page
      // 3. Show success message
    } catch (error) {
      console.error("Error creating role:", error);
      // Show error message
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Left side - Form */}
      <div className="col-span-1 xl:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{tForm("roleInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="roleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("roleName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tForm("roleNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={tForm("descriptionPlaceholder")}
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tForm("roleType")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={tForm("selectRoleType")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleTypes.map((roleType) => (
                            <SelectItem
                              key={roleType.value}
                              value={roleType.value}
                            >
                              {roleType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? tForm("creating")
                      : tForm("createRole")}
                  </Button>
                  <Link
                    href="/settings/roles"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    {tForm("cancel")}
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Preview */}
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{tForm("rolePreview")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {watchedValues.roleName || tForm("newRole")}
              </h3>
              {watchedValues.type && (
                <Badge variant="outline" className="mt-2">
                  {tTypes(watchedValues.type)}
                </Badge>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {watchedValues.description || tForm("newRoleDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NewRoleForm;
