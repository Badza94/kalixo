import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import BalanceCarousel from "@/components/finance/balance/balance-carousel";
import wallets from "@/data/wallets.json";
import { AddCurrencyAccountDialog } from "@/components/finance/balance/add-currency-account-dialog";
import { RecentActivities } from "@/components/finance/balance/recent-activities";
import currencies from "@/data/currencies.json";
import Filters from "@/components/finance/balance/filters";
import channels from "@/data/channels.json";
import companies from "@/data/companies.json";

interface SearchParams {
  startDate?: string;
  endDate?: string;
  types?: string;
  statuses?: string;
  currencies?: string;
  limit?: string;
  page?: string;
  searchQuery?: string;
  companies?: string;
  channels?: string;
}

async function Balance(props: { searchParams: Promise<SearchParams> }) {
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

  const initialStatuses = searchParams.statuses
    ? Array.isArray(searchParams.statuses)
      ? searchParams.statuses
      : [searchParams.statuses]
    : [];

  const initialCurrencies = searchParams.currencies
    ? Array.isArray(searchParams.currencies)
      ? searchParams.currencies
      : [searchParams.currencies]
    : [];

  const initialCompanies = searchParams.companies
    ? Array.isArray(searchParams.companies)
      ? searchParams.companies
      : [searchParams.companies]
    : [];

  const initialChannels = searchParams.channels
    ? Array.isArray(searchParams.channels)
      ? searchParams.channels
      : [searchParams.channels]
    : [];

  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialLimit = searchParams.limit ?? "10";
  const initialSearchQuery = searchParams.searchQuery ?? "";

  const t = await getTranslations("Finance.Balance");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <AddCurrencyAccountDialog />
      </div>

      <Filters
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        currencies={currencies}
        initialCurrencies={initialCurrencies}
        initialCompanies={initialCompanies}
        initialSearchQuery={initialSearchQuery}
        initialChannels={initialChannels}
        channels={channels}
        companies={companies}
      />

      <BalanceCarousel wallets={wallets} />

      <RecentActivities
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        initialTypes={initialTypes}
        initialStatuses={initialStatuses}
        currencies={currencies}
        initialCurrency={initialCurrencies}
        initialLimit={initialLimit}
        initialPage={initialPage}
        totalPages={10}
      />
    </div>
  );
}

export default Balance;
