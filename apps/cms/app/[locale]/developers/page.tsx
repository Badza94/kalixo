import LogReader from "@/components/developers/log-reader";
import PageTitle from "@/components/page-title";
import Filters from "./filters";

interface SearchParams {
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  types?: string[];
}

export default async function DevelopersPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const initialDateFrom = searchParams.startDate
    ? new Date(searchParams.startDate as string)
    : new Date(new Date().getFullYear(), 0, 1);
  const initialDateTo = searchParams.endDate
    ? new Date(searchParams.endDate as string)
    : new Date();

  const initialTypes = searchParams.types
    ? Array.isArray(searchParams.types)
      ? searchParams.types
      : [searchParams.types]
    : [];
  const initialSearchQuery = searchParams.searchQuery ?? "";

  return (
    <div className="space-y-4">
      <PageTitle
        title="Logs"
        description={
          "View and manage application logs for debugging and monitoring."
        }
      />

      <Filters
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        initialTypes={initialTypes}
        initialSearchQuery={initialSearchQuery}
      />

      <LogReader
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        initialTypes={initialTypes}
        initialSearchQuery={initialSearchQuery}
      />
    </div>
  );
}
