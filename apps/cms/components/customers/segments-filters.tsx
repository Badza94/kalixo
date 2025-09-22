"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";

interface SegmentsFiltersProps {
  initialSearchQuery?: string;
  initialStatuses?: string[];
  initialCreatedBy?: string[];
}

// Status options will be dynamically created with translations

const CREATED_BY_OPTIONS = [
  { value: "john_smith", label: "John Smith" },
  { value: "sarah_johnson", label: "Sarah Johnson" },
  { value: "mike_wilson", label: "Mike Wilson" },
  { value: "lisa_chen", label: "Lisa Chen" },
  { value: "david_brown", label: "David Brown" },
  { value: "emily_davis", label: "Emily Davis" },
  { value: "robert_taylor", label: "Robert Taylor" },
  { value: "anna_martinez", label: "Anna Martinez" },
];

function SegmentsFilters({
  initialSearchQuery = "",
  initialStatuses = [],
  initialCreatedBy = [],
}: SegmentsFiltersProps) {
  const ft = useTranslations("Customers.Segments.filters");
  const t = useTranslations("Customers.Segments.table.statuses");
  const fit = useTranslations("Filters");

  const router = useRouter();
  const searchParams = useSearchParams();

  const STATUS_OPTIONS = [
    { value: "active", label: t("active") },
    { value: "inactive", label: t("inactive") },
  ];

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>(initialStatuses);
  const [selectedCreatedBy, setSelectedCreatedBy] =
    useState<string[]>(initialCreatedBy);
  const [expanded, setExpanded] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle search
    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    } else {
      params.delete("search");
    }

    // Handle status filter
    if (selectedStatuses.length > 0) {
      params.delete("statuses");
      selectedStatuses.forEach((status) => {
        params.append("statuses", status);
      });
    } else {
      params.delete("statuses");
    }

    // Handle created by filter
    if (selectedCreatedBy.length > 0) {
      params.delete("createdBy");
      selectedCreatedBy.forEach((creator) => {
        params.append("createdBy", creator);
      });
    } else {
      params.delete("createdBy");
    }

    router.push(`?${params.toString()}`);
  }, [
    debouncedSearchQuery,
    selectedStatuses,
    selectedCreatedBy,
    searchParams,
    router,
  ]);

  useEffect(() => {
    handleApply();
  }, [handleApply]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setSelectedCreatedBy([]);
  };

  const renderStatusItem = (option: { value: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          option.value === "active" ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      <span>{option.label}</span>
    </div>
  );

  const renderCreatedByItem = (option: { value: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
        {option.label
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <span>{option.label}</span>
    </div>
  );

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={ft("searchSegments")}
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => setExpanded(!expanded)}>
            {fit("moreFilters")}
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
              options={STATUS_OPTIONS}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder={ft("selectStatuses")}
              variant="inverted"
              maxCount={0}
              renderItem={renderStatusItem}
            />
            <MultiSelect
              options={CREATED_BY_OPTIONS}
              onValueChange={setSelectedCreatedBy}
              defaultValue={selectedCreatedBy}
              placeholder={ft("selectCreatedBy")}
              variant="inverted"
              maxCount={0}
              renderItem={renderCreatedByItem}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => handleReset()}>
              {fit("reset")}
            </Button>
            <Button onClick={handleApply}>{fit("apply")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SegmentsFilters;
