import { zodResolver } from "@workspace/ui/hookform";
import { useForm } from "@workspace/ui/react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import businessTypesJson from "@/data/businessTypes.json";
const businessTypes = businessTypesJson.map((type) => type.value) as any[];

type BusinessDetailsType = {
  country: string;
  businessLegalName: string;
  businessTradeName?: string;
  registrationNumber: string;
  businessType: string;
  website: string;
};

function BusinessDetails({
  onSubmit,
  formData,
}: {
  onSubmit: (data: BusinessDetailsType) => void;
  formData: BusinessDetailsType;
}) {
  const t = useTranslations("AuthPages");
  const ft = useTranslations("Forms");

  const formSchema = z.object({
    country: z.string().min(1, { message: ft("Errors.requiredCountry") }),
    businessLegalName: z
      .string()
      .min(1, { message: ft("Errors.requiredBusinessLegalName") }),
    businessTradeName: z.string().optional(),
    registrationNumber: z
      .string()
      .min(1, ft("Errors.requiredRegistrationNumber"))
      .refine(
        (value) => {
          const regex = /^[A-Z0-9]{1,20}$/; // Adjust the regex as per your requirement
          return regex.test(value);
        },
        {
          message: ft("Errors.invalidRegistrationNumber"),
        }
      ),
    businessType:
      businessTypes.length > 0
        ? z.enum([businessTypes[0], ...businessTypes.slice(1)])
        : z.string(),
    website: z
      .string()
      .min(1, ft("Errors.requiredWebsite"))
      .url(ft("Errors.invalidWebsite")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: formData.country || "",
      businessLegalName: formData.businessLegalName || "",
      businessTradeName: formData.businessTradeName || "",
      registrationNumber: formData.registrationNumber || "",
      businessType: formData.businessType || "",
      website: formData.website || "",
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("BusinessDetailsPage.title")}
          </CardTitle>
          <CardDescription className="text-left">
            {t("BusinessDetailsPage.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("BusinessDetailsPage.countryOfIncorporation.title")}
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
                  name="businessLegalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("BusinessDetailsPage.businessLegalName.title")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "BusinessDetailsPage.businessLegalName.description"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessTradeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("BusinessDetailsPage.businessTradeName.title")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "BusinessDetailsPage.businessTradeName.description"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("BusinessDetailsPage.registrationNumber.title")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "BusinessDetailsPage.registrationNumber.description"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("BusinessDetailsPage.businessType.title")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t(
                                "BusinessDetailsPage.businessType.description"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {businessTypesJson.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {t(
                                `BusinessDetailsPage.businessType.options.${type.label}`
                              )}
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("BusinessDetailsPage.website.title")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            "BusinessDetailsPage.website.description"
                          )}
                          {...field}
                        />
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

export default BusinessDetails;
