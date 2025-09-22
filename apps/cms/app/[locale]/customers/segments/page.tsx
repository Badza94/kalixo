import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import { CreateSegmentDialog } from "@/components/customers/create-segment-dialog";
import SegmentsTable from "@/components/customers/segments-table";
import SegmentsFilters from "@/components/customers/segments-filters";
import segmentsData from "@/data/segmentsData.json";

interface Segment {
  id: string;
  name: string;
  description: string;
  tags: string[];
  customerPercentage: number;
  createdAt: string;
  createdBy: string;
  status: "active" | "inactive";
  conditions: string[];
  sqlQuery: string;
}

interface SearchParams {
  status: "active" | "inactive";
  search?: string;
  statuses?: string;
  page?: string;
  limit?: string;
  createdBy?: string;
}
async function Segments(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("Customers.Segments");

  // Extract filter parameters
  const initialSearchQuery = searchParams.search || "";

  const initialStatuses = searchParams.statuses
    ? Array.isArray(searchParams.statuses)
      ? searchParams.statuses
      : [searchParams.statuses]
    : [];
  const initialCreatedBy = searchParams.createdBy
    ? Array.isArray(searchParams.createdBy)
      ? searchParams.createdBy
      : [searchParams.createdBy]
    : [];

  // Extract pagination parameters
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialLimit = searchParams.limit ?? "10";

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <CreateSegmentDialog />
      </div>
      <SegmentsFilters
        initialSearchQuery={initialSearchQuery}
        initialStatuses={initialStatuses}
        initialCreatedBy={initialCreatedBy}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <SegmentsTable
            segments={segmentsData as Segment[]}
            initialPage={initialPage}
            initialLimit={initialLimit}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default Segments;
