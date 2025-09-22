import React from "react";
import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import RolesFilters from "@/components/settings/roles/filters";
import RolesTable from "@/components/settings/roles/table";
import rolesData from "@/data/rolesData.json";
import { buttonVariants } from "@workspace/ui/components/button";
import { PlusIcon } from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";

interface SearchParams {
  roleTypes?: string;
  roleStatuses?: string;
  searchQuery?: string;
  limit?: string;
  page?: string;
}

async function RolesPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("Settings.Roles");

  const initialRoleTypes = searchParams.roleTypes
    ? Array.isArray(searchParams.roleTypes)
      ? searchParams.roleTypes
      : [searchParams.roleTypes]
    : [];

  const initialRoleStatuses = searchParams.roleStatuses
    ? Array.isArray(searchParams.roleStatuses)
      ? searchParams.roleStatuses
      : [searchParams.roleStatuses]
    : [];

  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <Link
          href="/settings/roles/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Role
        </Link>
      </div>

      <RolesFilters
        initialRoleTypes={initialRoleTypes}
        initialRoleStatuses={initialRoleStatuses}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <RolesTable
            roles={rolesData}
            initialLimit={initialLimit}
            initialPage={initialPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default RolesPage;
