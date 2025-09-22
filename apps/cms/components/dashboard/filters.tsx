"use client";

import { ComponentType, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useTranslations } from "next-intl";

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

interface FiltersProps {
  initialDateFrom: Date;
  initialDateTo: Date;

  initialChannels?: string[];
  channels: MultiSelectOption[];

  initialProductTypes?: string[];
  productTypes: MultiSelectOption[];

  initialCurrencies?: string[];
  currencies: MultiSelectOption[];

  initialCountries?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countries: any[];
}

export const Filters: React.FC<FiltersProps> = ({
  initialDateFrom,
  initialDateTo,
  initialChannels,
  channels,
  initialProductTypes,
  productTypes,
  initialCurrencies,
  currencies,
  initialCountries,
  countries,
}) => {
  const router = useRouter();

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: initialDateFrom,
    to: initialDateTo,
  });
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    initialChannels || []
  );
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    initialProductTypes || []
  );
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    initialCurrencies || []
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialCountries || []
  );

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApply = useCallback(() => {
    const newSearchParams = new URLSearchParams();

    newSearchParams.set("startDate", formatDate(selectedDateRange.from));
    newSearchParams.set("endDate", formatDate(selectedDateRange.to));

    selectedChannels.forEach((channel) =>
      newSearchParams.append("channels", channel)
    );
    selectedProductTypes.forEach((productType) =>
      newSearchParams.append("productTypes", productType)
    );
    selectedCurrencies.forEach((currency) =>
      newSearchParams.append("currencies", currency)
    );
    selectedCountries.forEach((country) =>
      newSearchParams.append("countries", country)
    );

    router.push(`/dashboard?${newSearchParams.toString()}`);
  }, [
    router,
    selectedDateRange,
    selectedChannels,
    selectedProductTypes,
    selectedCurrencies,
    selectedCountries,
  ]);

  const handleReset = useCallback(() => {
    setSelectedDateRange({
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(),
    });
    setSelectedChannels([]);
    setSelectedProductTypes([]);
    setSelectedCurrencies([]);
    setSelectedCountries([]);
    router.push(`/dashboard`);
  }, [router]);

  const t = useTranslations("Filters");

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap justify-between gap-4 items-center">
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
              options={productTypes}
              onValueChange={setSelectedProductTypes}
              defaultValue={selectedProductTypes}
              placeholder={t("productTypes")}
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
};

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
