"use client";

import { useState, useEffect } from "react";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import { useTranslations } from "next-intl";
import { toast } from "@workspace/ui/sonner";
import { PlusIcon } from "@workspace/ui/lucide-react";
import * as z from "@workspace/ui/lib/zod";

import {
  Dialog,
  DialogContent,
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Switch } from "@workspace/ui/components/switch";
import { CalendarDatePicker } from "@/components/calendar-date-picker";

// Import data
import categoriesData from "@/data/categories.json";
import productsData from "@/data/productsData.json";
import channelsData from "@/data/channels.json";
import { Promotion } from "./promotions-table";

// Form schema
const promotionSchema = z.object({
  global: z.boolean().optional(),
  channels: z.array(z.string()).optional(),
  couponCode: z.string().min(1, "Coupon code is required"),
  description: z.string().optional(),
  discountType: z.enum(["percent", "amount", "buyget"], {
    message: "Please select a discount type",
  }),
  percentValue: z.string().optional(),
  amountValue: z.string().optional(),
  buyValue: z.string().optional(),
  getValue: z.string().optional(),
  appliesTo: z.enum(["all", "categories", "products"], {
    message: "Please select an applies to option",
  }),
  specificCategories: z.array(z.string()).optional(),
  specificProducts: z.array(z.string()).optional(),
  // Active dates
  startDate: z.date().optional(),
  startTime: z.string().optional(),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  nonExpiringCoupon: z.boolean().optional(),
  localTimeTracking: z.boolean().optional(),
  // Usage
  limitTotalUses: z.boolean().optional(),
  totalUsesLimit: z.string().optional(),
  limitOneUsePerAccount: z.boolean().optional(),
  // Minimum requirements
  minimumRequirement: z.enum(["none", "amount", "quantity"], {
    message: "Please select a minimum requirement option",
  }),
  minimumPurchaseAmount: z.string().optional(),
  minimumQuantityOfItems: z.string().optional(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

// Function to generate random coupon code
const generateCouponCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface AddPromotionDialogProps {
  promotion?: Promotion;
}

export default function AddPromotionDialog({
  promotion,
}: AddPromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Marketing.Promotions.addPromotionDialog");

  const isEditing = !!promotion;

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      global: false,
      channels: [],
      couponCode: "",
      description: "",
      discountType: "percent",
      percentValue: "",
      amountValue: "",
      buyValue: "",
      getValue: "",
      appliesTo: "all",
      specificCategories: [],
      specificProducts: [],
      // Active dates
      startDate: undefined,
      startTime: "",
      endDate: undefined,
      endTime: "",
      nonExpiringCoupon: false,
      localTimeTracking: false,
      // Usage
      limitTotalUses: false,
      totalUsesLimit: "",
      limitOneUsePerAccount: false,
      // Minimum requirements
      minimumRequirement: "none",
      minimumPurchaseAmount: "",
      minimumQuantityOfItems: "",
    },
  });

  // Watch form values for conditional rendering
  const watchedGlobal = form.watch("global");
  const watchedDiscountType = form.watch("discountType");
  const watchedAppliesTo = form.watch("appliesTo");
  const watchedNonExpiring = form.watch("nonExpiringCoupon");
  const watchedLimitTotalUses = form.watch("limitTotalUses");
  const watchedMinimumRequirement = form.watch("minimumRequirement");

  // Prepare data for multiselect components
  const channelOptions = channelsData.map((channel) => ({
    value: channel.id.toString(),
    label: channel.label,
  }));

  const categoryOptions = categoriesData.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const productOptions = productsData.map((product) => ({
    value: product.id.toString(),
    label: product.name,
  }));

  const onSubmit = (data: PromotionFormValues) => {
    console.log("Promotion form data:", data);

    if (isEditing) {
      console.log("Updating promotion:", promotion?.id);
      toast.success(`Promotion "${data.couponCode}" updated successfully`);
    } else {
      console.log("Creating new promotion");
      toast.success(t("promotionCreated"));
    }

    setOpen(false);
    form.reset();

    // Clear edit parameter from URL if editing
    if (isEditing) {
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleAutoGenerate = () => {
    const newCode = generateCouponCode();
    form.setValue("couponCode", newCode);
  };

  // Effect to prefill form when editing
  useEffect(() => {
    if (promotion && open) {
      // Convert promotion data to form format
      const formData: Partial<PromotionFormValues> = {
        global: promotion.global,
        channels: promotion.channels.map((c) => c.id.toString()),
        couponCode: promotion.couponCode,
        description: promotion.description,
        discountType: promotion.discountType,
        percentValue: promotion.percentValue,
        amountValue: promotion.amountValue,
        buyValue: promotion.buyValue,
        getValue: promotion.getValue,
        appliesTo: promotion.appliesTo,
        specificCategories: promotion.specificCategories,
        specificProducts: promotion.specificProducts,
        startDate: promotion.startDate
          ? new Date(promotion.startDate)
          : undefined,
        startTime: promotion.startTime,
        endDate: promotion.endDate ? new Date(promotion.endDate) : undefined,
        endTime: promotion.endTime,
        nonExpiringCoupon: promotion.nonExpiringCoupon,
        localTimeTracking: promotion.localTimeTracking,
        limitTotalUses: promotion.limitTotalUses,
        totalUsesLimit: promotion.totalUsesLimit,
        limitOneUsePerAccount: promotion.limitOneUsePerAccount,
        minimumRequirement: promotion.minimumRequirement,
        minimumPurchaseAmount: promotion.minimumPurchaseAmount,
        minimumQuantityOfItems: promotion.minimumQuantityOfItems,
      };

      // Reset form with the promotion data
      form.reset(formData);
    }
  }, [promotion, open, form]);

  // Effect to open dialog when promotion is provided for editing
  useEffect(() => {
    if (promotion) {
      setOpen(true);
    }
  }, [promotion]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      // Clear the edit parameter from URL when closing
      if (isEditing) {
        const url = new URL(window.location.href);
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
      }
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("editTitle", { couponCode: promotion?.couponCode })
              : t("title")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Channels Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="global"
                  render={({ field }) => (
                    <FormItem className="flex flex-row-reverse items-center gap-4 justify-self-start space-y-0">
                      <FormLabel className="font-medium">
                        {t("global")}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("channels")}</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={channelOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder={t("selectChannels")}
                          variant="inverted"
                          animation={2}
                          maxCount={5}
                          className=""
                          disabled={watchedGlobal}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="couponCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("couponCode")}</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={t("couponCodePlaceholder")}
                            {...field}
                            className="flex-1"
                          />
                        </FormControl>
                        <Button type="button" onClick={handleAutoGenerate}>
                          {t("autoGenerate")}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("couponCodeDescription")}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("descriptionField")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("descriptionPlaceholder")}
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Discount Types Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="my-4">
                        {t("discountTypes")}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2"
                        >
                          {/* Percent Off Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="percent" id="percent" />
                            <div className="flex-1 space-y-2">
                              <Label htmlFor="percent" className="font-medium">
                                {t("percentOff")}
                              </Label>
                              {watchedDiscountType === "percent" && (
                                <div className="space-y-2">
                                  <FormField
                                    control={form.control}
                                    name="percentValue"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder={t(
                                              "percentPlaceholder"
                                            )}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    {t("percentOnly")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Amount Off Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="amount" id="amount" />
                            <div className="flex-1 space-y-2">
                              <Label htmlFor="amount" className="font-medium">
                                {t("amountOff")}
                              </Label>
                              {watchedDiscountType === "amount" && (
                                <div className="space-y-2">
                                  <FormField
                                    control={form.control}
                                    name="amountValue"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder={t("amountPlaceholder")}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    {t("amountDescription")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Buy X Get Y Option */}
                          <div className="flex items-center space-x-4">
                            <RadioGroupItem value="buyget" id="buyget" />
                            <div className="flex-1 space-y-2">
                              <Label htmlFor="buyget" className="font-medium">
                                {t("buy")} X {t("get")} Y
                              </Label>
                              {watchedDiscountType === "buyget" && (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="buyValue"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel htmlFor="buy">
                                            {t("buy")}
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder={t("buyPlaceholder")}
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="getValue"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel htmlFor="get">
                                            {t("get")}
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder={t("getPlaceholder")}
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {t("minimumDescription")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Applies to Section */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="appliesTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="my-4">{t("appliesTo")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2"
                        >
                          {/* All Products Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all" className="font-medium">
                              {t("allProducts")}
                            </Label>
                          </div>

                          {/* Specific Categories Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value="categories"
                              id="categories"
                            />
                            <div className="flex-1 space-y-2">
                              <Label
                                htmlFor="categories"
                                className="font-medium"
                              >
                                {t("specificCategories")}
                              </Label>
                              {watchedAppliesTo === "categories" && (
                                <FormField
                                  control={form.control}
                                  name="specificCategories"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <MultiSelect
                                          options={categoryOptions}
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          placeholder={t("searchCategories")}
                                          variant="inverted"
                                          animation={2}
                                          maxCount={5}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>

                          {/* Specific Products Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="products" id="products" />
                            <div className="flex-1">
                              <Label htmlFor="products" className="font-medium">
                                {t("specificProducts")}
                              </Label>
                              {watchedAppliesTo === "products" && (
                                <FormField
                                  control={form.control}
                                  name="specificProducts"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <MultiSelect
                                          options={productOptions}
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          placeholder={t("searchProducts")}
                                          variant="inverted"
                                          animation={2}
                                          maxCount={5}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Active dates Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("activeDates")}</h3>

                {/* Date and Time Pickers */}
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("startDate")}</FormLabel>
                        <FormControl>
                          <CalendarDatePicker
                            date={{
                              from: field.value || new Date(),
                              to: field.value || new Date(),
                            }}
                            onDateSelect={(range) => field.onChange(range.from)}
                            numberOfMonths={1}
                            closeOnSelect={true}
                            variant="outline"
                            className={
                              watchedNonExpiring
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("startTime")}</FormLabel>
                        <FormControl className="relative">
                          <Input
                            placeholder="11:32"
                            type="time"
                            {...field}
                            disabled={watchedNonExpiring}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("endDate")}</FormLabel>
                        <FormControl>
                          <CalendarDatePicker
                            date={{
                              from: field.value || new Date(),
                              to: field.value || new Date(),
                            }}
                            onDateSelect={(range) => field.onChange(range.from)}
                            numberOfMonths={1}
                            closeOnSelect={true}
                            variant="outline"
                            className={
                              watchedNonExpiring
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("endTime")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="--:--"
                            type="time"
                            {...field}
                            disabled={watchedNonExpiring}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nonExpiringCoupon"
                    render={({ field }) => (
                      <FormItem className="flex flex-row-reverse items-center justify-self-start gap-4 space-y-0">
                        <FormLabel className="font-medium">
                          {t("nonExpiringCoupon")}
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localTimeTracking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row-reverse items-center gap-4 justify-self-start space-y-0">
                        <FormLabel className="font-medium">
                          {t("localTimeTracking")}
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Usage Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("usage")}</h3>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="limitTotalUses"
                    render={({ field }) => (
                      <FormItem className="flex flex-row-reverse items-center gap-4 justify-self-start space-y-0">
                        <FormLabel className="font-medium">
                          {t("limitTotalUses")}
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {watchedLimitTotalUses && (
                    <div className="space-y-2 ml-12">
                      <FormField
                        control={form.control}
                        name="totalUsesLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={t("totalUsesPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className="text-sm text-muted-foreground">
                        {t("totalUsesDescription")}
                      </p>
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="limitOneUsePerAccount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row-reverse items-center gap-4 justify-self-start space-y-0">
                      <FormLabel className="font-medium">
                        {t("limitOneUsePerAccount")}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Minimum Requirements Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {t("minimumRequirements")}
                </h3>

                <FormField
                  control={form.control}
                  name="minimumRequirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-4"
                        >
                          {/* None Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none" className="font-medium">
                              {t("none")}
                            </Label>
                          </div>

                          {/* Minimum Purchase Amount Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="amount" id="amount" />
                            <div className="flex-1 space-y-2">
                              <Label htmlFor="amount" className="font-medium">
                                {t("minimumPurchaseAmount")}
                              </Label>
                              {watchedMinimumRequirement === "amount" && (
                                <div className="space-y-2">
                                  <FormField
                                    control={form.control}
                                    name="minimumPurchaseAmount"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder={t(
                                              "minimumPurchaseAmountPlaceholder"
                                            )}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    {t("minimumPurchaseAmountDescription")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Minimum Quantity of Items Option */}
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="quantity" id="quantity" />
                            <div className="flex-1 space-y-2">
                              <Label htmlFor="quantity" className="font-medium">
                                {t("minimumQuantityOfItems")}
                              </Label>
                              {watchedMinimumRequirement === "quantity" && (
                                <div className="space-y-2">
                                  <FormField
                                    control={form.control}
                                    name="minimumQuantityOfItems"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder={t(
                                              "minimumQuantityOfItemsPlaceholder"
                                            )}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {t("goBack")}
                </Button>
                <Button type="submit">
                  {isEditing ? t("updatePromotion") : t("saveChanges")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
