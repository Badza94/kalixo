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

const EVENT_TYPE_OPTIONS = [
  { label: "Info", value: "info" },
  { label: "Success", value: "success" },
  { label: "Error", value: "error" },
  { label: "Warn", value: "warn" },
  { label: "API", value: "api" },
];

function Filters({
  initialDateFrom,
  initialDateTo,
  initialTypes,
  initialSearchQuery = "",
}: {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialTypes: string[];
  initialSearchQuery?: string;
}) {
  const t = useTranslations("Filters");
  const ct = useTranslations("Developers");

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialTypes || []
  );

  const handleReset = () => {
    router.push(`/developers`);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // useDebounce to delay the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    // Only update search when debounced value changes
    if (debouncedSearchQuery !== undefined && debouncedSearchQuery !== "") {
      // Get current search params
      const currentParams = new URLSearchParams(window.location.search);

      if (debouncedSearchQuery) {
        currentParams.set("searchQuery", debouncedSearchQuery);
      } else {
        currentParams.delete("searchQuery");
      }

      router.push(`/developers?${currentParams.toString()}`, { scroll: false });
    }
  }, [debouncedSearchQuery, router]);

  const handleApply = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);

    currentParams.delete("dateFrom");
    currentParams.delete("dateTo");
    currentParams.delete("searchQuery");
    currentParams.delete("types");

    selectedTypes.forEach((type) => {
      currentParams.append("types", type);
    });

    currentParams.set(
      "startDate",
      formatDate(selectedDateRange.from, "yyyy-MM-dd")
    );
    currentParams.set(
      "endDate",
      formatDate(selectedDateRange.to, "yyyy-MM-dd")
    );

    router.push(`/developers?${currentParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateRange.from, selectedDateRange.to, selectedTypes]);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={ct("search")}
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
              options={EVENT_TYPE_OPTIONS}
              onValueChange={setSelectedTypes}
              defaultValue={selectedTypes}
              placeholder={t("eventTypes")}
              variant="inverted"
              maxCount={0}
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
