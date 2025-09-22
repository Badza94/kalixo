"use client";

import { Check, ChevronsUpDown } from "@workspace/ui/lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useState } from "react";

export function SelectSearch({
  data,
  placeholder = "Select...",
  nothingFound = "Nothing found.",
  value,
  setValue,
  disabled = false,
  className,
}: {
  data: {
    value: string;
    label: string | React.ReactNode;
  }[];
  placeholder?: string;
  nothingFound?: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn("w-full", className)}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          disabled={disabled}
        >
          <span>
            {value ? data.find((d) => d.value === value)?.label : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
        <Command className="w-full">
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{nothingFound}</CommandEmpty>
            <CommandGroup>
              {data.map((d) => (
                <CommandItem
                  key={d.value}
                  value={d.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {d.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === d.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
