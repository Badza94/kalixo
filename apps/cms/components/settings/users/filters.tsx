/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { ComponentType, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import useDebounce from "@workspace/ui/hooks/use-debounce";

type MultiSelectOption = {
  /** The text to display for the option. */
  label: string;
  /** The unique value associated with the option. */
  value: string;
  /** Optional icon component to display alongside the option. */
  icon?: ComponentType<{ className?: string }> | string;

  /** Optional image URL to display alongside the option. */
  image?: string;

  id?: number;
};

function UsersFilters({
  initialCompanies,
  companies,
  initialTypes,
  initialStatuses,
}: {
  initialCompanies?: string[];
  companies: any[];
  initialTypes?: string[];
  initialStatuses?: string[];
}) {
  const t = useTranslations("Filters");
  const tf = useTranslations("Settings.Users.filters");
  const tSearch = useTranslations("Settings.Users");
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialCompanies || []
  );

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialTypes || []
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialStatuses || []
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleReset = () => {
    router.push(`/settings/users`);
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("companies");
    currentParams.delete("types");
    currentParams.delete("statuses");

    // Add new filter values
    selectedCompanies.forEach((company) =>
      currentParams.append("companies", company)
    );

    selectedTypes.forEach((type) => currentParams.append("types", type));

    selectedStatuses.forEach((status) =>
      currentParams.append("statuses", status)
    );

    router.push(`/settings/users?${currentParams.toString()}`);
  }, [router, selectedCompanies, selectedTypes, selectedStatuses]);

  // Remove the immediate search call here – just update the state:
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

      router.push(`/settings/users?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  const typeOptions: MultiSelectOption[] = [
    { label: tf("types.superAdministrator"), value: "superAdministrator" },
    { label: tf("types.administrator"), value: "administrator" },
    { label: tf("types.channelAdmin"), value: "channelAdmin" },
    { label: tf("types.adminView"), value: "adminView" },
    { label: tf("types.companyAdmin"), value: "companyAdmin" },
    { label: tf("types.companyChannelAdmin"), value: "companyChannelAdmin" },
    { label: tf("types.partner"), value: "partner" },
    { label: tf("types.vendor"), value: "vendor" },
    { label: tf("types.agency"), value: "agency" },
  ];

  const statusOptions: MultiSelectOption[] = [
    { label: tf("statuses.active"), value: "active" },
    { label: tf("statuses.pending"), value: "pending" },
    { label: tf("statuses.inactive"), value: "inactive" },
    { label: tf("statuses.suspended"), value: "suspended" },
  ];

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tSearch("search")}
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
              options={companies.map((company: any) => ({
                label: company.companyName,
                value: company.id.toString(),
              }))}
              onValueChange={setSelectedCompanies}
              defaultValue={selectedCompanies}
              placeholder={tf("company")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={typeOptions}
              onValueChange={setSelectedTypes}
              defaultValue={selectedTypes}
              placeholder={tf("type")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={statusOptions}
              onValueChange={setSelectedStatuses}
              defaultValue={selectedStatuses}
              placeholder={tf("status")}
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

export default UsersFilters;
