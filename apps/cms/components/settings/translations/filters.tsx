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
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";

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

function TranslationsFilters({
  initialLocales,
  locales,
}: {
  initialLocales?: string[];
  locales?: string[];
}) {
  const t = useTranslations("Filters");
  const tf = useTranslations("Settings.Translations.filters");
  const tSearch = useTranslations("Settings.Translations");
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const [selectedLocales, setSelectedLocales] = useState<string[]>(
    initialLocales || []
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleReset = () => {
    router.push(`/settings/translations`);
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("locales");

    // Add new filter values
    selectedLocales.forEach((locale) =>
      currentParams.append("locales", locale)
    );

    router.push(`/settings/translations?${currentParams.toString()}`);
  }, [router, selectedLocales]);

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

      router.push(`/settings/translations?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

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
              options={locales as unknown as MultiSelectOption[]}
              onValueChange={setSelectedLocales}
              defaultValue={selectedLocales}
              placeholder={tf("locale")}
              variant="inverted"
              maxCount={0}
              renderItem={(option: { label: string; icon: string }) => (
                <Countries countryCode={option.icon} label={option.label} />
              )}
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
function Countries(props: { countryCode: string; label: string }) {
  return (
    <div className="flex items-end gap-2">
      <CircleFlag
        className="h-4 w-4"
        countryCode={props.countryCode.toLowerCase()}
      />
      <span className="text-sm font-medium">{props.label}</span>
    </div>
  );
}
export default TranslationsFilters;
