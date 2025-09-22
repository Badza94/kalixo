import Filters from "@/components/finance/companies/filters";
import CompaniesHeader from "@/components/finance/companies/header";
import CompaniesTable from "@/components/finance/companies/companies-table";

import countries from "@/data/countries.json";
import companies from "@/data/companies.json";

interface SearchParams {
  countries?: string;
  statuses?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  limit?: string;
  view?: string;
  page?: string;
}

async function Companies(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const initialCountries = searchParams.countries
    ? Array.isArray(searchParams.countries)
      ? searchParams.countries
      : [searchParams.countries]
    : [];

  const initialStatuses = searchParams.statuses
    ? Array.isArray(searchParams.statuses)
      ? searchParams.statuses
      : [searchParams.statuses]
    : [];

  const initialDateFrom = searchParams.dateFrom
    ? new Date(searchParams.dateFrom)
    : new Date();

  const initialDateTo = searchParams.dateTo
    ? new Date(searchParams.dateTo)
    : new Date();

  const initialSort = searchParams.sort ?? "newest";
  const initialLimit = searchParams.limit ?? "10";
  const initialView = searchParams.view ?? "list";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <div className="space-y-4">
      <CompaniesHeader />
      <Filters
        initialCountries={initialCountries}
        countries={countries}
        initialStatuses={initialStatuses}
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <CompaniesTable
            companies={companies}
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

export default Companies;
