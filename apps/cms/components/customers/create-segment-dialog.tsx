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
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { toast } from "@workspace/ui/sonner";
import { useTranslations } from "next-intl";
import {
  Plus,
  Search,
  DollarSign,
  Heart,
  Users,
  ShoppingCart,
  Calendar,
  UserX,
  MapPin,
  TrendingUp,
  Zap,
  Mail,
  Smartphone,
  Monitor,
} from "@workspace/ui/lucide-react";
import { useState } from "react";
import { Separator } from "@workspace/ui/components/separator";
import { CreateCustomSegmentDialog } from "./create-custom-segment-dialog";

interface SegmentTemplate {
  id: string;
  title: string;
  description: string;
  customerCount: number;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  conditions: string[];
}

const segmentTemplates: SegmentTemplate[] = [
  // Customer Engagement
  {
    id: "high-value",
    title: "High Value Customers",
    description: "Customers with total purchases over $1000",
    customerCount: 156,
    tags: ["High Value", "VIP", "Revenue"],
    icon: DollarSign,
    group: "Customer Engagement",
    conditions: ["total_purchase_amount > 1000", "customer_status = 'active'"],
  },
  {
    id: "vip-customers",
    title: "VIP Customers",
    description: "Top 5% customers by lifetime value",
    customerCount: 67,
    tags: ["VIP", "Premium", "Top Tier"],
    icon: Heart,
    group: "Customer Engagement",
    conditions: ["lifetime_value_percentile >= 95", "vip_status = 'true'"],
  },
  {
    id: "repeat-customers",
    title: "Repeat Customers",
    description: "Customers with more than one order",
    customerCount: 743,
    tags: ["Loyal", "Repeat", "Retention"],
    icon: Users,
    group: "Customer Engagement",
    conditions: [
      "order_count > 1",
      "last_order_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)",
    ],
  },

  // Re-engagement
  {
    id: "cart-abandonment",
    title: "Cart Abandonment",
    description:
      "Customers who added items to cart but didn't complete purchase",
    customerCount: 289,
    tags: ["Abandoned Cart", "Recovery", "Conversion"],
    icon: ShoppingCart,
    group: "Re-engagement",
    conditions: [
      "cart_status = 'abandoned'",
      "cart_updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      "order_completed = 'false'",
    ],
  },
  {
    id: "lapsed-buyers",
    title: "Lapsed Buyers",
    description:
      "Customers who bought before but haven't purchased in 3 months",
    customerCount: 456,
    tags: ["Lapsed", "Winback", "Re-engagement"],
    icon: Calendar,
    group: "Re-engagement",
    conditions: [
      "last_purchase_date < DATE_SUB(NOW(), INTERVAL 3 MONTH)",
      "total_orders > 0",
    ],
  },
  {
    id: "inactive-visitors",
    title: "Inactive Visitors",
    description: "Customers who haven't visited the site in 3 months",
    customerCount: 678,
    tags: ["Inactive", "Dormant", "Re-engagement"],
    icon: UserX,
    group: "Re-engagement",
    conditions: [
      "last_login_date < DATE_SUB(NOW(), INTERVAL 3 MONTH)",
      "account_status = 'active'",
    ],
  },

  // Target Location
  {
    id: "location-us",
    title: "Location Based - US",
    description: "Customers located in the United States",
    customerCount: 1234,
    tags: ["Location", "US", "Geographic"],
    icon: MapPin,
    group: "Target Location",
    conditions: ["billing_country = 'US'", "shipping_country = 'US'"],
  },
  {
    id: "location-uk",
    title: "Location Based - UK",
    description: "Customers located in the United Kingdom",
    customerCount: 567,
    tags: ["Location", "UK", "Geographic"],
    icon: MapPin,
    group: "Target Location",
    conditions: ["billing_country = 'GB'", "shipping_country = 'GB'"],
  },
  {
    id: "location-europe",
    title: "Location Based - Europe",
    description: "Customers located in European countries",
    customerCount: 892,
    tags: ["Location", "Europe", "Geographic"],
    icon: MapPin,
    group: "Target Location",
    conditions: [
      "billing_country IN ('DE', 'FR', 'IT', 'ES', 'NL', 'BE')",
      "region = 'Europe'",
    ],
  },

  // Purchase Behavior
  {
    id: "recent-customers",
    title: "Recent Customers",
    description: "Customers who made a purchase in the last 30 days",
    customerCount: 324,
    tags: ["Recent", "Active", "Purchase"],
    icon: TrendingUp,
    group: "Purchase Behavior",
    conditions: [
      "last_purchase_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
      "order_status = 'completed'",
    ],
  },
  {
    id: "subscription-buyers",
    title: "Subscription Buyers",
    description: "Customers with active subscription plans",
    customerCount: 198,
    tags: ["Subscription", "Recurring", "Loyalty"],
    icon: Zap,
    group: "Purchase Behavior",
    conditions: [
      "subscription_status = 'active'",
      "billing_type = 'recurring'",
    ],
  },
  {
    id: "brand-loyalists",
    title: "Brand Loyalists",
    description: "Customers who frequently purchase from specific brands",
    customerCount: 445,
    tags: ["Brand", "Loyalty", "Affinity"],
    icon: Heart,
    group: "Purchase Behavior",
    conditions: [
      "brand_purchase_frequency >= 3",
      "preferred_brand IS NOT NULL",
    ],
  },

  // Storefront Behaviors
  {
    id: "email-subscribers",
    title: "Email Subscribers",
    description: "Customers who have subscribed to email newsletters",
    customerCount: 2156,
    tags: ["Email", "Newsletter", "Engagement"],
    icon: Mail,
    group: "Storefront Behaviors",
    conditions: [
      "email_subscription_status = 'subscribed'",
      "marketing_emails_enabled = 'true'",
    ],
  },
  {
    id: "mobile-users",
    title: "Mobile Users",
    description: "Customers who primarily shop using mobile devices",
    customerCount: 1789,
    tags: ["Mobile", "Device", "Experience"],
    icon: Smartphone,
    group: "Storefront Behaviors",
    conditions: ["device_type = 'mobile'", "mobile_app_usage > 50"],
  },
  {
    id: "desktop-users",
    title: "Desktop Users",
    description: "Customers who primarily shop using desktop computers",
    customerCount: 987,
    tags: ["Desktop", "Device", "Experience"],
    icon: Monitor,
    group: "Storefront Behaviors",
    conditions: [
      "device_type = 'desktop'",
      "browser_sessions > mobile_sessions",
    ],
  },
];

const createSegmentSchema = z.object({
  segmentName: z.string().min(2, "Segment name must be at least 2 characters"),
  description: z.string().optional(),
  selectedTemplate: z.string().optional(),
});

type CreateSegmentFormValues = z.infer<typeof createSegmentSchema>;

export function CreateSegmentDialog() {
  const td = useTranslations("Customers.Segments.createSegmentDialog");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const form = useForm<CreateSegmentFormValues>({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: {
      segmentName: "",
      description: "",
      selectedTemplate: "",
    },
  });

  // Filter templates based on search query
  const filteredTemplates = segmentTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Group filtered templates
  const groupedTemplates = filteredTemplates.reduce(
    (groups, template) => {
      const group = template.group;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(template);
      return groups;
    },
    {} as Record<string, SegmentTemplate[]>
  );

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = segmentTemplates.find((t) => t.id === templateId);
    if (template) {
      form.setValue("segmentName", template.title);
      form.setValue("description", template.description);
      form.setValue("selectedTemplate", templateId);
    }
  };

  function onSubmit(values: CreateSegmentFormValues) {
    // TODO: handle submit
    console.log(values);
    toast.success(td("segmentCreated"));
    form.reset();
    setSelectedTemplate(null);
    setSearchQuery("");
    setOpen(false);
  }

  const formatCustomerCount = (count: number) => {
    return `~${count.toLocaleString()} customers`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {td("createSegment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader className="flex flex-row justify-between mt-4">
          <DialogTitle>{td("title")}</DialogTitle>
          <CreateCustomSegmentDialog />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="segmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("segmentName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={td("segmentNamePlaceholder")}
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
                    <FormLabel>{td("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={td("descriptionPlaceholder")}
                        className="min-h-[40px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={td("searchTemplates")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Separator className="my-4" />

              <ScrollArea className="h-[515px]">
                <div className="space-y-6 mt-4 mx-2">
                  {Object.entries(groupedTemplates).map(
                    ([groupName, templates]) => (
                      <div key={groupName} className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">
                          {groupName}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {templates.map((template) => {
                            const IconComponent = template.icon;
                            const isSelected = selectedTemplate === template.id;

                            return (
                              <Card
                                key={template.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  isSelected
                                    ? "ring-2 ring-primary bg-primary/5"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleTemplateSelect(template.id)
                                }
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                      <IconComponent className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm leading-tight">
                                        {template.title}
                                      </h5>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs px-2 py-0.5 mt-2"
                                      >
                                        {formatCustomerCount(
                                          template.customerCount
                                        )}
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {template.description}
                                  </p>
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1">
                                      {template.tags.slice(0, 2).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className="text-xs px-2 py-0.5"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {template.tags.length > 2 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-2 py-0.5"
                                        >
                                          +{template.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
                {selectedTemplate && (
                  <div className="space-y-4 mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium">
                      {td("templateConditions")}
                    </h4>
                    <div className="space-y-2">
                      {segmentTemplates
                        .find((t) => t.id === selectedTemplate)
                        ?.conditions.map((condition, index) => (
                          <div
                            key={index}
                            className="bg-muted/50 px-3 py-2 rounded font-mono text-sm border"
                          >
                            {condition}
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        {td("estimatedCustomers")}
                      </span>
                      <span className="text-sm font-medium">
                        {formatCustomerCount(
                          segmentTemplates.find(
                            (t) => t.id === selectedTemplate
                          )?.customerCount || 0
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                  setSelectedTemplate(null);
                  setSearchQuery("");
                }}
              >
                {td("cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? td("creating")
                  : td("createSegment")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
