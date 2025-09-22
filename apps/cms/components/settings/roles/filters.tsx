"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  icon?: React.ComponentType<{ className?: string }> | string;
  /** Optional image URL to display alongside the option. */
  image?: string;
  id?: number;
};

interface RolesFiltersProps {
  initialRoleTypes?: string[];
  initialRoleStatuses?: string[];
}

function RolesFilters({
  initialRoleTypes,
  initialRoleStatuses,
}: RolesFiltersProps) {
  const t = useTranslations("Filters");
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const [selectedRoleTypes, setSelectedRoleTypes] = useState<string[]>(
    initialRoleTypes || []
  );
  const [selectedRoleStatuses, setSelectedRoleStatuses] = useState<string[]>(
    initialRoleStatuses || []
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleReset = () => {
    router.push(`/settings/roles`);
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("roleTypes");
    currentParams.delete("roleStatuses");

    // Add new filter values
    selectedRoleTypes.forEach((roleType) =>
      currentParams.append("roleTypes", roleType)
    );
    selectedRoleStatuses.forEach((roleStatus) =>
      currentParams.append("roleStatuses", roleStatus)
    );

    router.push(`/settings/roles?${currentParams.toString()}`);
  }, [router, selectedRoleTypes, selectedRoleStatuses]);

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

      router.push(`/settings/roles?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  // Role type options
  const roleTypeOptions: MultiSelectOption[] = [
    { label: t("roleTypes.system"), value: "system" },
    { label: t("roleTypes.admin"), value: "admin" },
    { label: t("roleTypes.custom"), value: "custom" },
  ];

  // Role status options
  const roleStatusOptions: MultiSelectOption[] = [
    { label: t("roleStatuses.active"), value: "active" },
    { label: t("roleStatuses.inactive"), value: "inactive" },
    { label: t("roleStatuses.draft"), value: "draft" },
  ];

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchRoles")}
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
              options={roleTypeOptions}
              onValueChange={setSelectedRoleTypes}
              defaultValue={selectedRoleTypes}
              placeholder={t("selectRoleType")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={roleStatusOptions}
              onValueChange={setSelectedRoleStatuses}
              defaultValue={selectedRoleStatuses}
              placeholder={t("selectRoleStatus")}
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

export default RolesFilters;
