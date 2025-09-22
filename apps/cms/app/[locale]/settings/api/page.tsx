import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import { startOfDay, endOfDay } from "@workspace/ui/lib/date-fns";
import NewApplicationDialog from "@/components/settings/api/new-application-dialog";
import Filters from "@/components/settings/api/filters";
import ApplicationsTable from "@/components/settings/api/applications-table";
import settingsData from "@/data/settings.json";

interface APISettingsPageProps {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  environments?: string | string[];
  statuses?: string | string[];
  companies?: string | string[];
  sort?: string;
  limit?: string;
  page?: string;
  edit?: string;
}

async function APISettingsPage(props: {
  searchParams: Promise<APISettingsPageProps>;
}) {
  const searchParams = await props.searchParams;

  const t = await getTranslations("Settings.APISettings");

  // Parse search params
  const search = searchParams.search || "";

  // Date range - default to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const dateFrom = searchParams.dateFrom
    ? startOfDay(new Date(searchParams.dateFrom))
    : startOfDay(thirtyDaysAgo);
  const dateTo = searchParams.dateTo
    ? endOfDay(new Date(searchParams.dateTo))
    : endOfDay(today);

  // Parse array parameters
  const environments = Array.isArray(searchParams.environments)
    ? searchParams.environments
    : searchParams.environments
      ? [searchParams.environments]
      : [];

  const statuses = Array.isArray(searchParams.statuses)
    ? searchParams.statuses
    : searchParams.statuses
      ? [searchParams.statuses]
      : [];

  const companies = Array.isArray(searchParams.companies)
    ? searchParams.companies
    : searchParams.companies
      ? [searchParams.companies]
      : [];

  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const editId = searchParams.edit;

  // Find application to edit
  const applicationToEdit = editId
    ? settingsData.find((app) => app.id === editId)
    : undefined;

  // Filter applications based on search parameters

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <NewApplicationDialog application={applicationToEdit} />
      </div>

      <Filters
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
        initialEnvironments={environments}
        initialStatuses={statuses}
        initialCompanies={companies}
        initialSearchQuery={search}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ApplicationsTable
            applications={settingsData}
            initialLimit={initialLimit}
            initialPage={initialPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default APISettingsPage;
