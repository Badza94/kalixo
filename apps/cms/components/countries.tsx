"use client";
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { cn, lowerCase } from "@workspace/ui/lib/utils";
import countries from "@/data/countries.json";

import { type CountryProps } from "@/types";
import { useTranslations } from "next-intl";

interface CountryDropdownProps {
  disabled?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  title?: string;
}

const CountryDropdown = ({
  disabled,
  value,
  onValueChange,
  title = "Select Country...",
}: CountryDropdownProps) => {
  const ft = useTranslations("Forms");
  const [countryValue, setCountryValue] = useState<string>(value || "");
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const C = countries as CountryProps[];

  return (
    <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCountryDropdown}
          className="w-full justify-start items-center"
          disabled={disabled}
        >
          <span className="flex w-full items-center justify-between">
            {countryValue ? (
              <div className="flex items-end gap-2">
                <CircleFlag
                  countryCode={
                    countries
                      .find(
                        (country) =>
                          lowerCase(country.name) === lowerCase(countryValue)
                      )
                      ?.value.toLowerCase() || ""
                  }
                  className="h-4 w-4"
                />
                <span>
                  {
                    countries.find(
                      (country) =>
                        lowerCase(country.name) === lowerCase(countryValue)
                    )?.name
                  }
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">{title}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>{ft("noCountryFound")}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px] w-full">
              {C.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={(currentValue) => {
                    setCountryValue(
                      lowerCase(currentValue) === lowerCase(country.name)
                        ? currentValue
                        : ""
                    );
                    onValueChange?.(currentValue);
                    setOpenCountryDropdown(false);
                  }}
                  className="flex cursor-pointer items-center justify-between"
                >
                  <div className="flex items-end gap-2">
                    <CircleFlag
                      countryCode={country.value.toLowerCase()}
                      className="h-4 w-4"
                    />
                    <span className="">{country.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      countryValue === lowerCase(country.name)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryDropdown;
