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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useForm } from "@workspace/ui/lib/react-hook-form";
import { zodResolver } from "@workspace/ui/lib/hookform";
import * as z from "@workspace/ui/lib/zod";
import { toast } from "@workspace/ui/sonner";
import { useTranslations } from "next-intl";
import { Plus, Play, X } from "@workspace/ui/lucide-react";
import { useState } from "react";

interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator: "AND" | "OR";
}

const createSegmentSchema = z.object({
  segmentName: z.string().min(2, "Segment name must be at least 2 characters"),
  description: z.string().optional(),
  segmentDescription: z
    .string()
    .min(10, "Please describe your segment in detail"),
});

type CreateSegmentFormValues = z.infer<typeof createSegmentSchema>;

const FIELD_OPTIONS = [
  { value: "customer_countries", label: "Customer countries" },
  { value: "customer_regions", label: "Customer regions" },
  { value: "customer_tags", label: "Customer tags" },
  { value: "orders_placed", label: "Orders placed" },
  { value: "email_subscription_status", label: "Email Subscription status" },
  { value: "total_amount", label: "Total amount" },
  { value: "last_order_date", label: "Last order date" },
  { value: "customer_added_date", label: "Customer Added Date" },
];

const OPERATOR_OPTIONS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Is not equal" },
  { value: "less_equal", label: "Smaller or equal to" },
  { value: "greater_equal", label: "Greater or equal to" },
  { value: "less_than", label: "Smaller than" },
  { value: "greater_than", label: "Greater than" },
  { value: "contains", label: "Contains" },
];

export function CreateCustomSegmentDialog() {
  const td = useTranslations("Customers.Segments.createCustomSegmentDialog");
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [generatedQuery, setGeneratedQuery] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const form = useForm<CreateSegmentFormValues>({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: {
      segmentName: "",
      description: "",
      segmentDescription: "",
    },
  });

  const generateConditions = async () => {
    const segmentDescription = form.getValues("segmentDescription");
    if (!segmentDescription.trim()) {
      toast.error("Please describe your segment first");
      return;
    }

    setIsGenerating(true);
    try {
      // Placeholder AI call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock generated conditions based on description
      const mockConditions: QueryCondition[] = [
        {
          id: "1",
          field: "customer_countries",
          operator: "equals",
          value: "US",
          logicalOperator: "AND",
        },
      ];

      setConditions(mockConditions);
      toast.success("Conditions generated successfully!");
    } catch {
      toast.error("Failed to generate conditions");
    } finally {
      setIsGenerating(false);
    }
  };

  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      field: "",
      operator: "",
      value: "",
      logicalOperator: "AND",
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  const updateCondition = (
    id: string,
    field: keyof QueryCondition,
    value: string
  ) => {
    setConditions(
      conditions.map((condition) =>
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    );
  };

  const toggleLogicalOperator = (id: string) => {
    setConditions(
      conditions.map((condition) =>
        condition.id === id
          ? {
              ...condition,
              logicalOperator:
                condition.logicalOperator === "AND" ? "OR" : "AND",
            }
          : condition
      )
    );
  };

  const generateSQLQuery = () => {
    if (conditions.length === 0) {
      return "";
    }

    let query =
      "FROM customers\nSHOW customer_name, note, email_subscription_status, location, orders, amount_spent\nWHERE ";

    conditions.forEach((condition, index) => {
      if (index > 0) {
        query += `\n${condition.logicalOperator} `;
      }

      const operatorMap: Record<string, string> = {
        equals: "=",
        not_equals: "!=",
        less_equal: "<=",
        greater_equal: ">=",
        less_than: "<",
        greater_than: ">",
        contains: "LIKE",
      };

      const sqlOperator = operatorMap[condition.operator] || "=";
      const value =
        condition.operator === "contains"
          ? `'%${condition.value}%'`
          : `'${condition.value}'`;

      query += `${condition.field} ${sqlOperator} ${value}`;
    });

    query += "\nORDER BY updated_at";
    return query;
  };

  const runQuery = async () => {
    if (conditions.length === 0) {
      toast.error("Please add at least one condition");
      return;
    }

    setIsRunning(true);
    const query = generateSQLQuery();
    setGeneratedQuery(query);

    try {
      // Placeholder for running the query
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Query executed successfully!");
    } catch {
      toast.error("Failed to run query");
    } finally {
      setIsRunning(false);
    }
  };

  function onSubmit(values: CreateSegmentFormValues) {
    if (conditions.length === 0) {
      toast.error("Please add at least one condition");
      return;
    }

    // TODO: handle submit
    console.log({
      ...values,
      conditions,
      generatedQuery,
    });

    toast.success(td("segmentCreated"));
    form.reset();
    setConditions([]);
    setGeneratedQuery("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {td("createSegment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader className="flex flex-row justify-between items-center mt-4">
          <DialogTitle>{td("title")}</DialogTitle>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            {td("useTemplate")}
          </Button>
        </DialogHeader>

        <ScrollArea className="h-[515px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="segmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{td("segmentName")} *</FormLabel>
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
                        <Input
                          placeholder={td("descriptionPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {td("buildCustomSegment")}
              </p>

              <FormField
                control={form.control}
                name="segmentDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td("describeSegment")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={td("segmentDescriptionPlaceholder")}
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={generateConditions}
                disabled={isGenerating}
                className="w-fit"
              >
                <Play className="mr-2 h-4 w-4" />
                {isGenerating ? td("generating") : td("generateConditions")}
              </Button>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {td("queryConditions")}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCondition}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {td("addCondition")}
                  </Button>
                </div>

                {conditions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    {td("noConditions")}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conditions.map((condition, index) => (
                      <div key={condition.id} className="space-y-2">
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                          <span className="text-sm font-medium w-8">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-medium">WHERE</span>

                          <Select
                            value={condition.field}
                            onValueChange={(value) =>
                              updateCondition(condition.id, "field", value)
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder={td("selectField")} />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(value) =>
                              updateCondition(condition.id, "operator", value)
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder={td("selectOperator")} />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATOR_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            placeholder={td("enterValue")}
                            value={condition.value}
                            onChange={(e) =>
                              updateCondition(
                                condition.id,
                                "value",
                                e.target.value
                              )
                            }
                            className="flex-1"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(condition.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {index < conditions.length - 1 && (
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleLogicalOperator(
                                  conditions[index + 1]?.id ?? ""
                                )
                              }
                              className="text-sm font-medium"
                            >
                              {conditions[index + 1]?.logicalOperator}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {conditions.length > 0 && (
                <>
                  <Button
                    type="button"
                    onClick={runQuery}
                    disabled={isRunning}
                    className="w-fit"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isRunning ? td("running") : td("runQuery")}
                  </Button>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {td("generatedQuery")}
                    </h4>
                    <ScrollArea className="h-32">
                      <pre className="bg-muted p-4 rounded-lg text-sm font-mono">
                        {generatedQuery}
                      </pre>
                    </ScrollArea>
                  </div>
                </>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                    setConditions([]);
                    setGeneratedQuery("");
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
