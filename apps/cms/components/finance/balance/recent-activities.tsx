"use client";
import { useCallback, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@workspace/ui/components/card";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { UpdateStatusDialog, FormValues } from "./update-status-dialog";
import recentActivities from "@/data/recent-activities.json";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { Currency } from "@/types";
import { format } from "@workspace/ui/lib/date-fns";
import { formatCurrency, formatDate } from "@workspace/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import DynamicPagination from "../../dynamic-pagination";
import { MoreHorizontal, SquarePenIcon } from "@workspace/ui/lucide-react";
import { toast } from "@workspace/ui/sonner";

const typeOptions = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Credit Card", value: "credit_card" },
];

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

type RecentActivitiesProps = {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialTypes: string[];
  initialStatuses: string[];
  currencies: Currency[];
  initialCurrency: string[];
  initialLimit: string;
  initialPage: number;
  totalPages: number;
};

export function RecentActivities({
  initialDateFrom,
  initialDateTo,
  initialTypes,
  initialStatuses,
  currencies,
  initialCurrency,
  initialLimit,
  initialPage,
  totalPages,
}: RecentActivitiesProps) {
  const locale = useLocale();
  const t = useTranslations("Filters");
  const ct = useTranslations("Common");
  const st = useTranslations("Status");
  const bt = useTranslations("Finance.Balance");
  const router = useRouter();

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const [selectedCurrency, setSelectedCurrency] = useState<string[]>(
    initialCurrency || []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialTypes || []
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialStatuses || []
  );

  const [selectedActivity, setSelectedActivity] = useState<
    (typeof recentActivities)[0] | null
  >(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">{st("pending")}</Badge>;
      case "completed":
        return <Badge variant="success">{st("completed")}</Badge>;
      case "failed":
        return <Badge variant="destructive">{st("failed")}</Badge>;
    }
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("types");
    currentParams.delete("statuses");
    currentParams.delete("currencies");

    selectedCurrency.forEach((currency) =>
      currentParams.append("currencies", currency)
    );

    selectedTypes.forEach((type) => currentParams.append("types", type));
    selectedStatuses.forEach((status) =>
      currentParams.append("statuses", status)
    );

    currentParams.set("startDate", formatDate(selectedDateRange.from));
    currentParams.set("endDate", formatDate(selectedDateRange.to));

    router.push(`/finance/balance?${currentParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDateRange,
    selectedDateRange,
    router,
    selectedCurrency,
    selectedTypes,
    selectedStatuses,
  ]);

  const handleReset = () => {
    setSelectedDateRange({
      from: initialDateFrom,
      to: initialDateTo,
    });
    setSelectedCurrency([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    router.push(`/finance/balance`);
  };

  const handleUpdateStatus = (values: FormValues) => {
    // TODO: Implement status update logic
    console.log("Updating status:", values);
    setIsUpdateStatusOpen(false);
    toast.success(bt("successUpdateStatus"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{bt("recentActivities")}</CardTitle>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-4">
            <CalendarDatePicker
              date={selectedDateRange}
              onDateSelect={setSelectedDateRange}
            />
            <MultiSelect
              options={currencies}
              onValueChange={setSelectedCurrency}
              defaultValue={selectedCurrency}
              placeholder="Select Currency"
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={typeOptions}
              onValueChange={setSelectedTypes}
              defaultValue={selectedTypes}
              placeholder="Select Types"
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={statusOptions}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder="Select Statuses"
              variant="inverted"
              maxCount={0}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleReset}>
              {t("reset")}
            </Button>
            <Button onClick={handleApply}>{t("apply")}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[515px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{ct("date")}</TableHead>
                <TableHead>{ct("type")}</TableHead>
                <TableHead>{ct("amount")}</TableHead>
                <TableHead>{ct("currency")}</TableHead>
                <TableHead>{ct("status")}</TableHead>
                <TableHead>{ct("reference")}</TableHead>
                <TableHead>{ct("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>{format(activity.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{ct(activity.type)}</TableCell>
                  <TableCell>
                    {formatCurrency(activity.amount, activity.currency, locale)}
                  </TableCell>
                  <TableCell>{activity.currency}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell>{activity.reference}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedActivity(activity);
                            setIsUpdateStatusOpen(true);
                          }}
                        >
                          <SquarePenIcon className="w-4 h-4 mr-2" />
                          {ct("changeStatus")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <CardFooter>
          <DynamicPagination
            currentPage={initialPage || 1}
            totalPages={totalPages}
            initialLimit={initialLimit}
          />
        </CardFooter>
      </CardContent>

      {selectedActivity && (
        <UpdateStatusDialog
          isOpen={isUpdateStatusOpen}
          onClose={() => {
            setIsUpdateStatusOpen(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
          onSubmit={handleUpdateStatus}
        />
      )}
    </Card>
  );
}
