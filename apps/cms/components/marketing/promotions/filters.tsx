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
import { MultiSelect } from "@workspace/ui/components/multi-select";

// Import data
import channelsData from "@/data/channels.json";

const DISCOUNT_TYPE_OPTIONS = [
  { label: "Percent off", value: "percent" },
  { label: "Amount off", value: "amount" },
  { label: "Buy X Get Y", value: "buyget" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Paused", value: "paused" },
  { label: "Terminated", value: "terminated" },
];

function Filters({
  initialDateFrom,
  initialDateTo,
  initialChannels,
  initialTypes,
  initialStatuses,
  initialSearchQuery = "",
}: {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialChannels: string[];
  initialTypes: string[];
  initialStatuses: string[];
  initialSearchQuery?: string;
}) {
  const t = useTranslations("Filters");
  const mt = useTranslations("Marketing.Promotions");

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    initialChannels || []
  );

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialTypes || []
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialStatuses || []
  );

  // Prepare channel options
  const channelOptions = channelsData.map((channel) => ({
    value: channel.id.toString(),
    label: channel.label,
  }));

  const handleReset = () => {
    router.push(`/marketing/promotions`);
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
        currentParams.set("search", debouncedSearchQuery);
      } else {
        currentParams.delete("search");
      }

      router.push(`/marketing/promotions?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  const handleApply = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);

    // Clear existing filter params
    currentParams.delete("dateFrom");
    currentParams.delete("dateTo");
    currentParams.delete("search");
    currentParams.delete("channels");
    currentParams.delete("types");
    currentParams.delete("statuses");

    // Add selected filters
    selectedChannels.forEach((channel) => {
      currentParams.append("channels", channel);
    });

    selectedTypes.forEach((type) => {
      currentParams.append("types", type);
    });

    selectedStatuses.forEach((status) => {
      currentParams.append("statuses", status);
    });

    currentParams.set(
      "dateFrom",
      formatDate(selectedDateRange.from, "yyyy-MM-dd")
    );
    currentParams.set("dateTo", formatDate(selectedDateRange.to, "yyyy-MM-dd"));

    router.push(`/marketing/promotions?${currentParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDateRange.from,
    selectedDateRange.to,
    selectedChannels,
    selectedTypes,
    selectedStatuses,
  ]);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={mt("search")}
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
            <MultiSelect
              options={channelOptions}
              onValueChange={setSelectedChannels}
              defaultValue={selectedChannels}
              placeholder={t("channels")}
              variant="inverted"
              maxCount={3}
            />
            <MultiSelect
              options={DISCOUNT_TYPE_OPTIONS}
              onValueChange={setSelectedTypes}
              defaultValue={selectedTypes}
              placeholder={t("discountTypes")}
              variant="inverted"
              maxCount={3}
            />
            <MultiSelect
              options={STATUS_OPTIONS}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder={t("status")}
              variant="inverted"
              maxCount={3}
            />
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
