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

const CHANNEL_TYPE_OPTIONS = [
  { label: "Bulk Ordering", value: "bulkOrdering" },
  { label: "1st Party", value: "firstParty" },
  { label: "White Label", value: "whiteLabel" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Marketing", value: "marketing" },
  { label: "Claim", value: "claim" },
  { label: "API", value: "api" },
  { label: "Custom", value: "custom" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Draft", value: "draft" },
];

function Filters({
  initialTypes,
  initialStatuses,
  initialSearchQuery = "",
}: {
  initialTypes: string[];
  initialStatuses: string[];
  initialSearchQuery?: string;
}) {
  const t = useTranslations("Filters");
  const ct = useTranslations("Channels");

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialTypes || []
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialStatuses || []
  );

  const handleReset = () => {
    router.push(`/channels`);
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

      router.push(`/channels?${currentParams.toString()}`, { scroll: false });
    }
  }, [debouncedSearchQuery, router]);

  const handleApply = useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);

    currentParams.delete("types");
    currentParams.delete("statuses");

    selectedTypes.forEach((type) => {
      currentParams.append("types", type);
    });

    selectedStatuses.forEach((status) => {
      currentParams.append("statuses", status);
    });

    router.push(`/channels?${currentParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes, selectedStatuses]);

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
            <MultiSelect
              options={CHANNEL_TYPE_OPTIONS}
              onValueChange={setSelectedTypes}
              defaultValue={selectedTypes}
              placeholder={ct("filters.channelTypes")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={STATUS_OPTIONS}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder={ct("filters.status")}
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
