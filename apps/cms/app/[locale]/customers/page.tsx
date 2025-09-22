import Filters from "@/components/customers/filters";
import CustomersHeader from "@/components/customers/header";
import CustomersTable from "@/components/customers/table";

import countries from "@/data/countries.json";
import customerTypes from "@/data/customerTypes.json";
import channels from "@/data/channels.json";
import customersData from "@/data/customersData.json";

interface SearchParams {
  countries?: string;
  customerTypes?: string;
  channels?: string;
  sort?: string;
  limit?: string;
  view?: string;
  page?: string;
}

async function Customers(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;

  const initialCountries = searchParams.countries
    ? Array.isArray(searchParams.countries)
      ? searchParams.countries
      : [searchParams.countries]
    : [];

  const initialCustomerTypes = searchParams.customerTypes
    ? Array.isArray(searchParams.customerTypes)
      ? searchParams.customerTypes
      : [searchParams.customerTypes]
    : [];

  const initialChannels = searchParams.channels
    ? Array.isArray(searchParams.channels)
      ? searchParams.channels
      : [searchParams.channels]
    : [];

  const initialSort = searchParams.sort ?? "newest";
  const initialLimit = searchParams.limit ?? "10";
  const initialView = searchParams.view ?? "list";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <div className="space-y-4 mb-4">
      <CustomersHeader />
      <Filters
        countries={countries}
        initialCountries={initialCountries}
        customerTypes={customerTypes}
        initialCustomerTypes={initialCustomerTypes}
        channels={channels}
        initialChannels={initialChannels}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <CustomersTable
            customers={customersData}
            initialSort={initialSort}
            initialLimit={initialLimit}
            initialView={initialView as "list" | "cards"}
            initialPage={initialPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default Customers;
