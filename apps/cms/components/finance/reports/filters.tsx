"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import { formatDate } from "@workspace/ui/lib/date-fns";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface FiltersProps {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialSearchQuery?: string;
  initialReportType?: string;
  initialStatus?: string;
  initialRequestedBy?: string;
}

// Mock users data for "Requested By" filter
const MOCK_USERS = [
  { id: "1", firstName: "John", lastName: "Doe" },
  { id: "2", firstName: "Jane", lastName: "Smith" },
  { id: "3", firstName: "Michael", lastName: "Johnson" },
  { id: "4", firstName: "Sarah", lastName: "Williams" },
];

function Filters({
  initialDateFrom,
  initialDateTo,
  initialSearchQuery = "",
  initialReportType = "",
  initialStatus = "",
  initialRequestedBy = "",
}: FiltersProps) {
  const t = useTranslations("Filters");
  const rt = useTranslations("Finance.Reports");
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const [selectedReportType, setSelectedReportType] =
    useState<string>(initialReportType);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [selectedRequestedBy, setSelectedRequestedBy] =
    useState<string>(initialRequestedBy);

  const handleReset = () => {
    router.push(`/finance/reports`);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // useDebounce to delay the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    // Only update search when debounced value changes
    if (debouncedSearchQuery !== undefined) {
      // Get current search params
      const currentParams = new URLSearchParams(window.location.search);

      if (debouncedSearchQuery) {
        currentParams.set("searchQuery", debouncedSearchQuery);
      } else {
        currentParams.delete("searchQuery");
      }

      router.push(`/finance/reports?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  const handleApply = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);

    // Clear existing filter params
    currentParams.delete("dateFrom");
    currentParams.delete("dateTo");
    currentParams.delete("searchQuery");
    currentParams.delete("reportType");
    currentParams.delete("status");
    currentParams.delete("requestedBy");

    // Add selected filters
    if (selectedReportType) {
      currentParams.set("reportType", selectedReportType);
    }

    if (selectedStatus) {
      currentParams.set("status", selectedStatus);
    }

    if (selectedRequestedBy) {
      currentParams.set("requestedBy", selectedRequestedBy);
    }

    // Add date range
    currentParams.set(
      "dateFrom",
      formatDate(selectedDateRange.from, "yyyy-MM-dd")
    );
    currentParams.set("dateTo", formatDate(selectedDateRange.to, "yyyy-MM-dd"));

    router.push(`/finance/reports?${currentParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDateRange.from,
    selectedDateRange.to,
    selectedReportType,
    selectedStatus,
    selectedRequestedBy,
  ]);

  // Report type options
  const reportTypeOptions = [
    { value: "sales", label: rt("reportTypesFilter.sales") },
    { value: "transactions", label: rt("reportTypesFilter.transactions") },
    { value: "balance", label: rt("reportTypesFilter.balance") },
    { value: "inventory", label: rt("reportTypesFilter.inventory") },
  ];

  // Status options
  const statusOptions = [
    { value: "completed", label: rt("statuses.completed") },
    { value: "processing", label: rt("statuses.processing") },
    { value: "pending", label: rt("statuses.pending") },
    { value: "failed", label: rt("statuses.failed") },
  ];

  // User options for "Requested By"
  const userOptions = MOCK_USERS.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={rt("search")}
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {t("moreFilters")}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div
          className={`flex flex-wrap gap-4 justify-between items-center overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-[500px] opacity-100 mt-8" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-4">
            <CalendarDatePicker
              date={selectedDateRange}
              onDateSelect={setSelectedDateRange}
            />

            <div className="flex flex-col space-y-2">
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={rt("selectReportTypeFilter")} />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={rt("selectStatusFilter")} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <Select
                value={selectedRequestedBy}
                onValueChange={setSelectedRequestedBy}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={rt("selectRequestedByFilter")} />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => handleReset()}>
              {t("reset")}
            </Button>
            <Button onClick={handleApply}>{t("apply")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Filters;
