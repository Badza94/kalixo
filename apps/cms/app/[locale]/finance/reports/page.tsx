import PageTitle from "@/components/page-title";
import AddReportDialog from "@/components/finance/reports/add-report-dialog";
import Filters from "@/components/finance/reports/filters";
import ReportsTable, {
  type Report,
} from "@/components/finance/reports/reports-table";
import reportsData from "@/data/reports.json";
import { getTranslations } from "next-intl/server";

interface SearchParams {
  page?: string;
  limit?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  reportType?: string;
  status?: string;
  requestedBy?: string;
}

async function Reports(props: { searchParams: Promise<SearchParams> }) {
  const t = await getTranslations("Finance.Reports");
  const searchParams = await props.searchParams;

  // Date range initialization
  const dateFrom = searchParams.dateFrom
    ? new Date(searchParams.dateFrom as string)
    : new Date(new Date().getFullYear(), 0, 1);
  const dateTo = searchParams.dateTo
    ? new Date(searchParams.dateTo as string)
    : new Date();

  // Search query
  const searchQuery = searchParams.searchQuery ?? "";

  // Filter values initialization
  const reportType = searchParams.reportType ?? "";
  const status = searchParams.status ?? "";
  const requestedBy = searchParams.requestedBy ?? "";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialLimit = searchParams.limit ?? "10";

  // Filter reports based on search parameters

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap space-y-4">
        <PageTitle title={t("title")} description={t("description")} />
        <AddReportDialog />
      </div>

      <Filters
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
        initialSearchQuery={searchQuery}
        initialReportType={reportType}
        initialStatus={status}
        initialRequestedBy={requestedBy}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ReportsTable
            reports={reportsData as Report[]}
            initialPage={initialPage}
            totalPages={10}
            initialLimit={initialLimit}
          />
        </div>
      </div>
    </div>
  );
}

export default Reports;
