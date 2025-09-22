import React from "react";
import UsersFilters from "@/components/settings/users/filters";
import UsersTable from "@/components/settings/users/table";

import companies from "@/data/companies.json";
import usersData from "@/data/usersData.json";
import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import { InviteUserDialog } from "@/components/settings/users/invite-user-dialog";

interface SearchParams {
  companies?: string;
  types?: string;
  statuses?: string;
  limit?: string;
  page?: string;
}

async function Users(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const t = await getTranslations("Settings.Users");

  const initialCompanies = searchParams.companies
    ? Array.isArray(searchParams.companies)
      ? searchParams.companies
      : [searchParams.companies]
    : [];

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

  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <InviteUserDialog />
      </div>
      <UsersFilters
        companies={companies}
        initialCompanies={initialCompanies}
        initialTypes={initialTypes}
        initialStatuses={initialStatuses}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <UsersTable
            users={usersData}
            initialLimit={initialLimit}
            initialPage={initialPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default Users;
