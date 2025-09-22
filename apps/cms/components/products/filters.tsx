/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, Search } from "@workspace/ui/lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import CountriesForMultiselect from "../countries-for-multiselect";
import { Country, CountryProps } from "@/types";

function Filters({
  initialCountries,
  countries,
  initialCurrencies,
  currencies,
  initialProductTypes,
  productTypes,
  brands,
  initialBrands,
  route = "products",
}: {
  initialCountries: string[];
  countries: CountryProps[];
  initialCurrencies: string[];
  currencies: any[];
  initialProductTypes?: string[];
  productTypes: any[];
  brands: any[];
  initialBrands?: string[];
  route?: string;
}) {
  const t = useTranslations("Filters");
  const pt = useTranslations("Products");
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialCountries || []
  );
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    initialCurrencies || []
  );

  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    initialProductTypes || []
  );

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrands || []
  );

  const handleReset = () => {
    // Get current search params to preserve table settings
    router.push(`/${route}`);
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("countries");
    currentParams.delete("currencies");
    currentParams.delete("productTypes");
    currentParams.delete("brands");

    // Add new filter values
    selectedCountries.forEach((country) =>
      currentParams.append("countries", country)
    );

    selectedCurrencies.forEach((currency) =>
      currentParams.append("currencies", currency)
    );

    selectedProductTypes.forEach((productType) =>
      currentParams.append("productTypes", productType)
    );

    selectedBrands.forEach((brand) => currentParams.append("brands", brand));

    router.push(`/${route}?${currentParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCountries,
    selectedCurrencies,
    selectedProductTypes,
    selectedBrands,
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");

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

      router.push(`/${route}?${currentParams.toString()}`, { scroll: false });
    }
  }, [debouncedSearchQuery, router, route]);

  return (
    <Card>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={pt("search")}
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
              options={countries as unknown as Country[]}
              onValueChange={setSelectedCountries}
              defaultValue={selectedCountries}
              placeholder={t("countries")}
              variant="inverted"
              maxCount={0}
              renderItem={(option: { value: string; name: string }) => (
                <CountriesForMultiselect
                  countryCode={option.value}
                  label={option.name}
                />
              )}
            />
            <MultiSelect
              options={currencies}
              onValueChange={setSelectedCurrencies}
              defaultValue={selectedCurrencies}
              placeholder={t("currencies")}
              variant="inverted"
              maxCount={0}
              renderItem={(option: {
                countryCode: string;
                currencyFullName: string;
                label: string;
              }) => (
                <Currencies
                  countryCode={option.countryCode}
                  currencyFullName={option.currencyFullName}
                  label={option.label}
                />
              )}
            />
            <MultiSelect
              options={productTypes}
              onValueChange={setSelectedProductTypes}
              defaultValue={selectedProductTypes}
              placeholder={t("productTypes")}
              variant="inverted"
              maxCount={0}
            />
            <MultiSelect
              options={brands}
              onValueChange={setSelectedBrands}
              defaultValue={selectedBrands}
              placeholder={t("brands")}
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

function Currencies(props: {
  countryCode: string;
  currencyFullName: string;
  label: string;
}) {
  return (
    <div className="flex items-end gap-2">
      <CircleFlag
        className="h-4 w-4"
        countryCode={props.countryCode.toLowerCase()}
      />
      <span className="text-sm font-medium">{props.label}</span>
      <span className="text-muted-foreground">({props.currencyFullName})</span>
    </div>
  );
}

export default Filters;
