import PageTitle from "@/components/page-title";
import React from "react";
import { getTranslations } from "next-intl/server";
import ChannelsHeader from "@/components/channels/header";
import Filters from "@/components/channels/filters";
import ChannelsTable from "@/components/channels/table";
import channelsData from "@/data/channelsData.json";

interface ChannelsPageProps {
  searchQuery?: string;
  types?: string | string[];
  statuses?: string | string[];
  page?: string;
  limit?: string;
  sortBy?: string;
}

export default async function ChannelsPage(props: {
  searchParams: Promise<ChannelsPageProps>;
}) {
  const t = await getTranslations("Channels");
  const searchParams = await props.searchParams;

  const searchQuery = searchParams.searchQuery || "";

  // Handle both single string and array of strings for types and statuses
  const types = Array.isArray(searchParams.types)
    ? searchParams.types
    : searchParams.types
      ? [searchParams.types]
      : [];

  const statuses = Array.isArray(searchParams.statuses)
    ? searchParams.statuses
    : searchParams.statuses
      ? [searchParams.statuses]
      : [];

  // Pagination and sorting
  const currentPage = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <ChannelsHeader />
      </div>
      <Filters
        initialSearchQuery={searchQuery}
        initialTypes={types}
        initialStatuses={statuses}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ChannelsTable
            channels={channelsData}
            initialLimit={limit.toString()}
            initialPage={currentPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}
