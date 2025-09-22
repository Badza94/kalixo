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
import currencies from "@/data/currencies.json";
import brands from "@/data/brands.json";
import channels from "@/data/channels.json";

interface FiltersProps {
  initialDateFrom: Date;
  initialDateTo: Date;
  initialSearchQuery?: string;
  initialCurrencies: string[];
  initialStatuses: string[];
  initialBrands: string[];
  initialChannels: string[];
  initialChannelTypes: string[];
}

function Filters({
  initialDateFrom,
  initialDateTo,
  initialSearchQuery = "",
  initialCurrencies,
  initialStatuses,
  initialBrands,
  initialChannels,
  initialChannelTypes,
}: FiltersProps) {
  const t = useTranslations("Filters");
  const ft = useTranslations("Finance.Transactions");
  const st = useTranslations("Status");

  // Status options
  const STATUS_OPTIONS = [
    { value: "pending", label: st("pending") },
    { value: "completed", label: st("completed") },
    { value: "failed", label: st("failed") },
    { value: "cancelled", label: st("cancelled") },
  ];

  // Currency options
  const CURRENCY_OPTIONS = currencies.map((currency) => ({
    value: currency.value,
    label: `${currency.label} (${currency.symbol})`,
  }));

  // Brand options
  const BRAND_OPTIONS = brands.map((brand) => ({
    value: brand.value,
    label: brand.label,
  }));

  // Channel type options (common channel types)
  const CHANNEL_TYPE_OPTIONS = [
    { value: "online", label: "Online" },
    { value: "retail", label: "Retail" },
    { value: "wholesale", label: "Wholesale" },
    { value: "direct", label: "Direct" },
    { value: "partner", label: "Partner" },
    { value: "affiliate", label: "Affiliate" },
  ];

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    initialCurrencies || []
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialStatuses || []
  );

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrands || []
  );

  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    initialChannels || []
  );

  const [selectedChannelTypes, setSelectedChannelTypes] = useState<string[]>(
    initialChannelTypes || []
  );

  const handleReset = () => {
    router.push(`/finance/transactions`);
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

      router.push(`/finance/transactions?${currentParams.toString()}`, {
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
    currentParams.delete("currencies");
    currentParams.delete("statuses");
    currentParams.delete("brands");
    currentParams.delete("channels");
    currentParams.delete("channelTypes");

    // Add selected filters
    selectedCurrencies.forEach((currency) => {
      currentParams.append("currencies", currency);
    });

    selectedStatuses.forEach((status) => {
      currentParams.append("statuses", status);
    });

    selectedBrands.forEach((brand) => {
      currentParams.append("brands", brand);
    });

    selectedChannels.forEach((channel) => {
      currentParams.append("channels", channel);
    });

    selectedChannelTypes.forEach((channelType) => {
      currentParams.append("channelTypes", channelType);
    });

    // Add date range
    currentParams.set(
      "dateFrom",
      formatDate(selectedDateRange.from, "yyyy-MM-dd")
    );
    currentParams.set("dateTo", formatDate(selectedDateRange.to, "yyyy-MM-dd"));

    router.push(`/finance/transactions?${currentParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDateRange.from,
    selectedDateRange.to,
    selectedCurrencies,
    selectedStatuses,
    selectedBrands,
    selectedChannels,
    selectedChannelTypes,
  ]);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={ft("search")}
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
              options={CURRENCY_OPTIONS}
              onValueChange={setSelectedCurrencies}
              defaultValue={selectedCurrencies}
              placeholder={t("currency")}
              variant="inverted"
              maxCount={2}
            />
            <MultiSelect
              options={STATUS_OPTIONS}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder={t("status")}
              maxCount={2}
            />
            <MultiSelect
              options={BRAND_OPTIONS}
              onValueChange={setSelectedBrands}
              defaultValue={selectedBrands}
              placeholder={t("brand")}
              variant="inverted"
              maxCount={2}
            />
            <MultiSelect
              options={channels}
              onValueChange={setSelectedChannels}
              defaultValue={selectedChannels}
              placeholder={t("channel")}
              variant="inverted"
              maxCount={2}
            />
            <MultiSelect
              options={CHANNEL_TYPE_OPTIONS}
              onValueChange={setSelectedChannelTypes}
              defaultValue={selectedChannelTypes}
              placeholder={t("channelType")}
              maxCount={2}
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
