import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import Filters from "@/components/applications/filters";
import ApplicationsTable from "@/components/applications/table";

async function ApplicationsPage() {
  const t = await getTranslations("Applications");
  return (
    <div className="space-y-4 mb-4">
      <PageTitle title={t("title")} description={t("description")} />
      <Filters />
      <ApplicationsTable />
    </div>
  );
}

export default ApplicationsPage;
