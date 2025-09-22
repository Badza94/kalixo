import PageTitle from "@/components/page-title";
import Filters from "@/components/settings/markets/filters";
import { AddMarketDialog } from "@/components/settings/markets/add-market-dialog";
import MarketsTable from "@/components/settings/markets/table";
import countries from "@/data/countries.json";
import marketsData from "@/data/marketsData.json";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface Market {
  id: number;
  marketName: string;
  marketType: "country" | "region";
  countries: string[];
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
  numberFormat: string;
  vatRate: number;
}

async function MarketsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("Settings.Markets");
  // Extract initial values from search params
  const initialSearchQuery = (searchParams.search as string) ?? "";
  const initialMarketType = (searchParams.marketType as string) ?? "";
  const initialCountries = searchParams.countries
    ? Array.isArray(searchParams.countries)
      ? searchParams.countries
      : [searchParams.countries]
    : [];

  // Pagination params
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialLimit = (searchParams.limit as string) ?? "10";

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <AddMarketDialog countries={countries} />
      </div>

      <Filters
        initialSearchQuery={initialSearchQuery}
        initialMarketType={initialMarketType}
        initialCountries={initialCountries}
        countries={countries}
      />

      <MarketsTable
        markets={marketsData as Market[]}
        initialPage={initialPage}
        initialLimit={initialLimit}
        totalPages={10}
      />
    </div>
  );
}

export default MarketsPage;
