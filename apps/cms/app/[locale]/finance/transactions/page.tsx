import PageTitle from "@/components/page-title";
import GenerateReportDialog from "@/components/finance/transactions/generate-report-dialog";
import Filters from "@/components/finance/transactions/filters";
import { getTranslations } from "next-intl/server";
import TransactionsTable, {
  Transaction,
} from "@/components/finance/transactions/transactions-table";

import transactionsData from "@/data/transactionsData.json";

interface SearchParams {
  page?: string;
  limit?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  currencies?: string | string[];
  statuses?: string | string[];
  brands?: string | string[];
  channels?: string | string[];
  channelTypes?: string | string[];
}

export default async function TransactionsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Finance.Transactions");
  const searchParams = await props.searchParams;

  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialLimit = searchParams.limit ?? "10";

  // Date range initialization
  const initialDateFrom = searchParams.dateFrom
    ? new Date(searchParams.dateFrom as string)
    : new Date(new Date().getFullYear(), 0, 1);
  const initialDateTo = searchParams.dateTo
    ? new Date(searchParams.dateTo as string)
    : new Date();

  // Search query
  const initialSearchQuery = searchParams.searchQuery ?? "";

  // Filter arrays initialization
  const initialCurrencies = searchParams.currencies
    ? Array.isArray(searchParams.currencies)
      ? searchParams.currencies
      : [searchParams.currencies]
    : [];

  const initialStatuses = searchParams.statuses
    ? Array.isArray(searchParams.statuses)
      ? searchParams.statuses
      : [searchParams.statuses]
    : [];

  const initialBrands = searchParams.brands
    ? Array.isArray(searchParams.brands)
      ? searchParams.brands
      : [searchParams.brands]
    : [];

  const initialChannels = searchParams.channels
    ? Array.isArray(searchParams.channels)
      ? searchParams.channels
      : [searchParams.channels]
    : [];

  const initialChannelTypes = searchParams.channelTypes
    ? Array.isArray(searchParams.channelTypes)
      ? searchParams.channelTypes
      : [searchParams.channelTypes]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap space-y-4">
        <PageTitle title={t("title")} description={t("description")} />
        <GenerateReportDialog />
      </div>

      <Filters
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        initialSearchQuery={initialSearchQuery}
        initialCurrencies={initialCurrencies}
        initialStatuses={initialStatuses}
        initialBrands={initialBrands}
        initialChannels={initialChannels}
        initialChannelTypes={initialChannelTypes}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <TransactionsTable
            transactions={transactionsData as unknown as Transaction[]}
            initialPage={initialPage}
            initialLimit={initialLimit}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}
