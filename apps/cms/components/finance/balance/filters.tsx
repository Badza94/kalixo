/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import { formatDate } from "@workspace/ui/lib/utils";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { MultiSelect } from "@workspace/ui/components/multi-select";

interface FiltersProps {
  initialDateFrom: Date;
  initialDateTo: Date;

  initialChannels?: string[];
  channels: any[];

  initialCurrencies?: string[];
  currencies: any[];

  initialCompanies?: string[];
  companies: any[];

  initialSearchQuery?: string;
}

function Filters({
  initialDateFrom,
  initialDateTo,
  initialChannels,
  channels,
  initialCurrencies,
  currencies,
  initialCompanies,
  companies,
  initialSearchQuery = "",
}: FiltersProps) {
  const t = useTranslations("Filters");
  const bt = useTranslations("Finance.Balance");

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

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    initialCurrencies || []
  );

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialCompanies || []
  );
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    router.push(`/finance/balance`);
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("dateFrom");
    currentParams.delete("dateTo");
    currentParams.delete("channels");
    currentParams.delete("currencies");
    currentParams.delete("companies");

    // Add new filter values
    currentParams.append("dateFrom", formatDate(selectedDateRange.from));
    currentParams.append("dateTo", formatDate(selectedDateRange.to));

    selectedChannels.forEach((channel) =>
      currentParams.append("channels", channel)
    );

    selectedCurrencies.forEach((currency) =>
      currentParams.append("currencies", currency)
    );

    selectedCompanies.forEach((company) =>
      currentParams.append("companies", company)
    );

    currentParams.set("search", searchQuery);

    router.push(`/finance/balance?${currentParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDateRange.from,
    selectedDateRange.to,
    selectedChannels,
    selectedCurrencies,
    selectedCompanies,
    searchQuery,
  ]);

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

      router.push(`/finance/balance?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  const transformCompanies = companies.map((company) => ({
    label: company.companyName,
    value: company.id,
  }));

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={bt("search")}
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
              options={channels}
              onValueChange={setSelectedChannels}
              defaultValue={selectedChannels}
              placeholder={t("channels")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={currencies}
              onValueChange={setSelectedCurrencies}
              defaultValue={selectedCurrencies}
              placeholder={t("currencies")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={transformCompanies}
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
