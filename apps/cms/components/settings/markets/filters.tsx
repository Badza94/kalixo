"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { SelectSearch } from "@workspace/ui/components/select-search";
import FilterCountryRender from "@/components/filter-countries-item";

interface MarketsFiltersProps {
  initialSearchQuery?: string;
  initialMarketType?: string;
  initialCountries?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countries: any[];
}

function Filters({
  initialSearchQuery = "",
  initialMarketType = "",
  initialCountries = [],
  countries,
}: MarketsFiltersProps) {
  const t = useTranslations("Filters");
  const mt = useTranslations("Settings.Markets");
  const router = useRouter();

  // Market type options
  const MARKET_TYPE_OPTIONS = [
    { value: "country", label: mt("marketTypes.country") },
    { value: "region", label: mt("marketTypes.region") },
  ];

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedMarketType, setSelectedMarketType] =
    useState<string>(initialMarketType);
  const [selectedCountries, setSelectedCountries] =
    useState<string[]>(initialCountries);

  const handleReset = () => {
    router.push("/settings/markets");
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // useDebounce to delay the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleApply = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    }

    if (selectedMarketType) {
      params.set("marketType", selectedMarketType);
    }

    if (selectedCountries.length > 0) {
      params.set("countries", selectedCountries.join(","));
    }

    const queryString = params.toString();
    const url = queryString
      ? `/settings/markets?${queryString}`
      : "/settings/markets";

    router.push(url);
  }, [debouncedSearchQuery, selectedMarketType, selectedCountries, router]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={mt("searchMarkets")}
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
            <SelectSearch
              data={MARKET_TYPE_OPTIONS}
              placeholder={mt("selectMarketType")}
              value={selectedMarketType}
              setValue={setSelectedMarketType}
              className="w-auto"
            />
            <MultiSelect
              options={countries}
              onValueChange={setSelectedCountries}
              defaultValue={selectedCountries}
              placeholder={mt("selectCountries")}
              variant="inverted"
              maxCount={0}
              renderItem={(option: { value: string; name: string }) => (
                <FilterCountryRender
                  countryCode={option.value}
                  label={option.name}
                />
              )}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleReset}>
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
