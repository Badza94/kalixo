import Filters from "@/components/products/filters";
import ProductTable from "@/components/orders/product-table";

import countries from "@/data/countries.json";
import currencies from "@/data/currencies.json";
import productTypes from "@/data/productTypes.json";
import brands from "@/data/brands.json";
import productsData from "@/data/productsData.json";
import PlaceOrderHeader from "@/components/orders/place-order-header";

interface SearchParams {
  countries?: string;
  currencies?: string;
  productTypes?: string;
  brands?: string;
  sort?: string;
  limit?: string;
  view?: string;
  page?: string;
}

async function PlaceOrderPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;

  const initialCountries = searchParams.countries
    ? Array.isArray(searchParams.countries)
      ? searchParams.countries
      : [searchParams.countries]
    : [];

  const initialCurrencies = searchParams.currencies
    ? Array.isArray(searchParams.currencies)
      ? searchParams.currencies
      : [searchParams.currencies]
    : [];

  const initialProductTypes = searchParams.productTypes
    ? Array.isArray(searchParams.productTypes)
      ? searchParams.productTypes
      : [searchParams.productTypes]
    : [];

  const initialBrands = searchParams.brands
    ? Array.isArray(searchParams.brands)
      ? searchParams.brands
      : [searchParams.brands]
    : [];

  const initialSort = searchParams.sort ?? "newest";
  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  return (
    <div className="space-y-4">
      <PlaceOrderHeader />
      <Filters
        countries={countries}
        initialCountries={initialCountries}
        currencies={currencies}
        initialCurrencies={initialCurrencies}
        productTypes={productTypes}
        initialProductTypes={initialProductTypes}
        brands={brands}
        initialBrands={initialBrands}
        route="orders/place-order"
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ProductTable
            products={productsData}
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

export default PlaceOrderPage;
