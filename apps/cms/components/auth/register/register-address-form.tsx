import { zodResolver } from "@workspace/ui/lib/hookform";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { z } from "@workspace/ui/lib/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import CountryDropdown from "@/components/countries";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import { Input } from "@workspace/ui/components/input";

type TRegisterAddressFormType = {
  countryOfRegistration: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
};

function RegisterAddressForm({
  onSubmit,
  formData,
}: {
  onSubmit: (data: TRegisterAddressFormType) => void;
  formData: TRegisterAddressFormType;
}) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    countryOfRegistration: z
      .string()
      .min(1, { message: ft("Errors.requiredCountry") }),
    postalCode: z.string().min(1, {
      message: ft("Errors.requiredPostalCode"),
    }),
    addressLine1: z.string().min(1, {
      message: ft("Errors.requiredAddressLine1"),
    }),
    addressLine2: z.string().optional(),
    city: z.string().min(1, { message: ft("Errors.requiredCity") }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryOfRegistration: formData.countryOfRegistration || "",
      postalCode: formData.postalCode || "",
      addressLine1: formData.addressLine1 || "",
      addressLine2: formData.addressLine2 || "",
      city: formData.city || "",
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("RegisterAddressPage.title")}
          </CardTitle>
          <CardDescription className="text-left">
            {t("RegisterAddressPage.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="countryOfRegistration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("RegisterAddressPage.countryOfRegistration.title")}
                      </FormLabel>
                      <FormControl>
                        <CountryDropdown
                          disabled={false}
                          value={field.value}
                          onValueChange={field.onChange}
                          title={ft("selectCountry")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ft("postalCode")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={ft("postalCodePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ft("addressLine1")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={ft("addressLine1Placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ft("addressLine2")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={ft("addressLine2Placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ft("city")}</FormLabel>
                      <FormControl>
                        <Input placeholder={ft("cityPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                {t("continue")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterAddressForm;
