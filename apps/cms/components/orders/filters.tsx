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
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import useDebounce from "@workspace/ui/hooks/use-debounce";
import { CalendarDatePicker } from "../calendar-date-picker";

type MultiSelectOption = {
  /** The text to display for the option. */
  label: string;
  /** The unique value associated with the option. */
  value: string;
  /** Optional icon component to display alongside the option. */
  icon?: ComponentType<{ className?: string }> | string;

  /** Optional image URL to display alongside the option. */
  image?: string;

  resellerCode?: string;

  id?: number;
};

function Filters({
  initialDateFrom,
  initialDateTo,
  initialCountries,
  countries,
  channels,
  initialChannels,
  paymentStatus,
  initialPaymentStatus,
  orderStatus,
  initialOrderStatus,
}: {
  initialDateFrom: Date;
  initialDateTo: Date;
  countries: any[];
  initialCountries: string[];
  channels: MultiSelectOption[];
  initialChannels?: string[];
  paymentStatus: any[];
  initialPaymentStatus?: string[];
  orderStatus: any[];
  initialOrderStatus?: string[];
}) {
  const t = useTranslations("Filters");
  const ct = useTranslations("Orders");
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialCountries || []
  );

  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    initialChannels || []
  );

  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string[]>(
    initialPaymentStatus || []
  );
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string[]>(
    initialOrderStatus || []
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleReset = () => {
    router.push(`/orders`);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApply = useCallback(() => {
    // Get current search params to preserve table settings
    const currentParams = new URLSearchParams(window.location.search);

    // Remove existing filter params before adding new ones
    currentParams.delete("countries");
    currentParams.delete("customerTypes");
    currentParams.delete("channels");
    currentParams.delete("paymentStatus");
    currentParams.delete("orderStatus");

    // Add new filter values
    selectedCountries.forEach((country) =>
      currentParams.append("countries", country)
    );

    selectedChannels.forEach((channel) =>
      currentParams.append("channels", channel)
    );

    selectedPaymentStatus.forEach((status) =>
      currentParams.append("paymentStatus", status)
    );
    selectedOrderStatus.forEach((status) =>
      currentParams.append("orderStatus", status)
    );

    currentParams.set("startDate", formatDate(selectedDateRange.from));
    currentParams.set("endDate", formatDate(selectedDateRange.to));

    router.push(`/orders?${currentParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCountries,
    selectedChannels,
    selectedPaymentStatus,
    selectedOrderStatus,
    selectedDateRange.from,
    selectedDateRange.to,
  ]);

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

      router.push(`/orders?${currentParams.toString()}`, { scroll: false });
    }
  }, [debouncedSearchQuery, router]);

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
            <CalendarDatePicker
              date={selectedDateRange}
              onDateSelect={setSelectedDateRange}
            />
            <MultiSelect
              options={countries}
              onValueChange={setSelectedCountries}
              defaultValue={selectedCountries}
              placeholder={t("countries")}
              variant="inverted"
              maxCount={0}
              renderItem={(option: { value: string; name: string }) => (
                <Countries countryCode={option.value} label={option.name} />
              )}
            />
            {/* <MultiSelect
              options={customerTypes}
              onValueChange={setSelectedCustomerTypes}
              defaultValue={selectedCustomerTypes}
              placeholder={t("customerTypes")}
              variant="inverted"
              maxCount={0}
            /> */}
            <MultiSelect
              options={channels}
              onValueChange={setSelectedChannels}
              defaultValue={selectedChannels}
              placeholder={t("channels")}
              variant="inverted"
              maxCount={0}
            />

            <MultiSelect
              options={paymentStatus}
              onValueChange={setSelectedPaymentStatus}
              defaultValue={selectedPaymentStatus}
              placeholder={t("paymentStatus")}
              variant="inverted"
              maxCount={0}
            />

            <MultiSelect
              options={orderStatus}
              onValueChange={setSelectedOrderStatus}
              defaultValue={selectedOrderStatus}
              placeholder={t("orderStatus")}
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

export default Filters;
