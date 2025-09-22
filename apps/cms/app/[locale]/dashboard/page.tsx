import PageTitle from "@/components/page-title";
import { Filters } from "@/components/dashboard/filters";
import { Stats } from "@/components/dashboard/stats";

import salesData from "@/data/salesData.json";
import SalesChart from "@/components/dashboard/sales-chart";
import BrandChart from "@/components/dashboard/brand-chart";
import TopProducts from "@/components/dashboard/top-products";
import SalesByCountry from "@/components/dashboard/sales-by-country";

import channels from "@/data/channels.json";
import productTypes from "@/data/productTypesFilters.json";
import currencies from "@/data/currencies.json";
import countries from "@/data/countries.json";
import stats from "@/data/stats.json";
import brandData from "@/data/brandData.json";
import topProducts from "@/data/topProducts.json";
import countryData from "@/data/countryData.json";

interface SearchParams {
  startDate?: string;
  endDate?: string;
  channels?: string;
  productTypes?: string;
  currencies?: string;
  countries?: string;
}

export default async function Home(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const initialDateFrom = searchParams.startDate
    ? new Date(searchParams.startDate as string)
    : new Date(new Date().getFullYear(), 0, 1);
  const initialDateTo = searchParams.endDate
    ? new Date(searchParams.endDate as string)
    : new Date();

  const initialChannels = searchParams.channels
    ? Array.isArray(searchParams.channels)
      ? searchParams.channels
      : [searchParams.channels]
    : [];

  const initialProductTypes = searchParams.productTypes
    ? Array.isArray(searchParams.productTypes)
      ? searchParams.productTypes
      : [searchParams.productTypes]
    : [];

  const initialCurrencies = searchParams.currencies
    ? Array.isArray(searchParams.currencies)
      ? searchParams.currencies
      : [searchParams.currencies]
    : [];

  const initialCountries = searchParams.countries
    ? Array.isArray(searchParams.countries)
      ? searchParams.countries
      : [searchParams.countries]
    : [];

  return (
    <div className="space-y-4">
      <PageTitle
        title="Dashboard"
        description="Monitor your business performance and analytics in real-time"
      />

      <Filters
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        initialChannels={initialChannels}
        channels={channels}
        initialProductTypes={initialProductTypes}
        productTypes={productTypes}
        initialCurrencies={initialCurrencies}
        currencies={currencies}
        initialCountries={initialCountries}
        countries={countries}
      />

      <Stats stats={stats} />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 2xl:col-span-8 3xl:col-span-9">
          <SalesChart data={salesData} />
        </div>
        <div className="col-span-12 2xl:col-span-4 3xl:col-span-3">
          <BrandChart data={brandData} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 2xl:col-span-8 3xl:col-span-9">
          <TopProducts products={topProducts} />
        </div>
        <div className="col-span-12 2xl:col-span-4 3xl:col-span-3">
          <SalesByCountry countries={countryData} />
        </div>
      </div>
    </div>
  );
}
