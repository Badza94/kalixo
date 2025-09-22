import React from "react";
import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import NewRoleForm from "@/components/settings/roles/new-role-form";

async function NewRolePage() {
  const t = await getTranslations("Settings.Roles.newRole");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
      </div>

      <NewRoleForm />
    </div>
  );
}

export default NewRolePage;
