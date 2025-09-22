"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { MultiSelect } from "@workspace/ui/components/multi-select";

// Import data
import companies from "@/data/companies.json";

interface FiltersProps {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialSearchQuery?: string;
  initialEnvironments: string[];
  initialStatuses: string[];
  initialCompanies: string[];
}

function Filters({
  initialDateFrom,
  initialDateTo,
  initialSearchQuery = "",
  initialEnvironments,
  initialStatuses,
  initialCompanies,
}: FiltersProps) {
  const t = useTranslations("Filters");
  const st = useTranslations("Status");
  const at = useTranslations("Settings.APISettings");

  // Environment options
  const ENVIRONMENT_OPTIONS = [
    { value: "development", label: at("environments.development") },
    { value: "staging", label: at("environments.staging") },
    { value: "production", label: at("environments.production") },
  ];

  // Status options
  const STATUS_OPTIONS = [
    { value: "active", label: st("active") },
    { value: "inactive", label: st("inactive") },
    { value: "pending", label: st("pending") },
    { value: "suspended", label: st("suspended") },
  ];

  // Company options
  const COMPANY_OPTIONS = companies.map((company) => ({
    value: company.id,
    label: company.companyName,
  }));

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(
    initialEnvironments || []
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialStatuses || []
  );

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialCompanies || []
  );

  const handleReset = () => {
    router.push(`/settings/api`);
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
        currentParams.set("search", debouncedSearchQuery);
      } else {
        currentParams.delete("search");
      }

      router.push(`/settings/api?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApply = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);

    // Clear existing filter params
    currentParams.delete("dateFrom");
    currentParams.delete("dateTo");
    currentParams.delete("search");
    currentParams.delete("environments");
    currentParams.delete("statuses");
    currentParams.delete("companies");

    // Add selected filters
    selectedEnvironments.forEach((environment) => {
      currentParams.append("environments", environment);
    });

    selectedStatuses.forEach((status) => {
      currentParams.append("statuses", status);
    });

    selectedCompanies.forEach((company) => {
      currentParams.append("companies", company);
    });

    // Add date range
    currentParams.set("dateFrom", formatDate(selectedDateRange.from));
    currentParams.set("dateTo", formatDate(selectedDateRange.to));

    router.push(`/settings/api?${currentParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDateRange.from,
    selectedDateRange.to,
    selectedEnvironments,
    selectedStatuses,
    selectedCompanies,
  ]);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={at("search")}
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
              options={ENVIRONMENT_OPTIONS}
              onValueChange={setSelectedEnvironments}
              defaultValue={selectedEnvironments}
              placeholder={at("environmentsLabel")}
              variant="inverted"
              maxCount={0}
            />

            <MultiSelect
              options={STATUS_OPTIONS}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder={t("status")}
              variant="inverted"
              maxCount={0}
            />

            <MultiSelect
              options={COMPANY_OPTIONS}
              onValueChange={setSelectedCompanies}
              defaultValue={selectedCompanies}
              placeholder={t("companies")}
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
