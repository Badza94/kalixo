"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Search } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@workspace/ui/components/input";
import { useRouter } from "next/navigation";
import useDebounce from "@workspace/ui/hooks/use-debounce";

function Filters() {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("Applications");
  const router = useRouter();
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

      router.push(`/applications?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedSearchQuery, router]);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Filters;
