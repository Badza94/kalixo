import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import Filters from "@/components/finance/invoices/filters";
import InvoicesTable from "@/components/finance/invoices/table";
import CreateInvoiceDialog from "@/components/finance/invoices/create-invoice-dialog";
import channels from "@/data/channels.json";
import companies from "@/data/companies.json";
import invoicesData from "@/data/invoices.json";
import { Invoice } from "@/components/finance/invoices/table";

interface SearchParams {
  dateFrom?: string;
  dateTo?: string;
  channels?: string;
  companies?: string;
  statuses?: string;
  searchQuery?: string;
  limit?: string;
  page?: string;
  sort?: string;
}

async function Invoices(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;

  // Initialize date range - default to current year
  const initialDateFrom = searchParams.dateFrom
    ? new Date(searchParams.dateFrom)
    : new Date(new Date().getFullYear(), 0, 1);
  const initialDateTo = searchParams.dateTo
    ? new Date(searchParams.dateTo)
    : new Date();

  // Initialize filter arrays
  const initialChannels = searchParams.channels
    ? Array.isArray(searchParams.channels)
      ? searchParams.channels
      : [searchParams.channels]
    : [];

  const initialCompanies = searchParams.companies
    ? Array.isArray(searchParams.companies)
      ? searchParams.companies
      : [searchParams.companies]
    : [];

  const initialStatuses = searchParams.statuses
    ? Array.isArray(searchParams.statuses)
      ? searchParams.statuses
      : [searchParams.statuses]
    : [];

  const initialSearchQuery = searchParams.searchQuery ?? "";
  const initialSort = searchParams.sort ?? "newest";
  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  const t = await getTranslations("Finance.Invoices");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <CreateInvoiceDialog />
      </div>

      <Filters
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        initialChannels={initialChannels}
        channels={channels}
        initialCompanies={initialCompanies}
        companies={companies}
        initialStatuses={initialStatuses}
        initialSearchQuery={initialSearchQuery}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <InvoicesTable
            invoices={invoicesData as Invoice[]}
            initialSort={initialSort}
            initialLimit={initialLimit}
            initialPage={initialPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default Invoices;
