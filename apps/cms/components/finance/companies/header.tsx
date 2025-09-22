"use client";

import PageTitle from "@/components/page-title";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Download, Plus, UploadIcon } from "@workspace/ui/lucide-react";
import { ImportDialog } from "@/components/import-dialog";

import { downloadCompaniesCsvTemplate } from "@/lib/csvUtils";
import { AddCompanyDialog } from "./add-company-dialog";

function CompaniesHeader() {
  const [openAddCompany, setOpenAddCompany] = useState(false);
  const t = useTranslations("Finance.Companies");
  const ct = useTranslations("Common");
  const [openImport, setOpenImport] = useState(false);

  return (
    <div className="flex justify-between items-center flex-wrap space-y-4">
      <PageTitle title={t("title")} description={t("description")} />

      <div className="flex gap-4 items-center">
        <Button variant="outline" onClick={() => setOpenImport(true)}>
          <UploadIcon className="mr-2" />
          {ct("import")}
        </Button>
        <Button variant="outline">
          <Download className="mr-2" />
          {ct("export")}
        </Button>
        <Button onClick={() => setOpenAddCompany(true)}>
          <Plus className="mr-2" />
          {t("addCompany")}
        </Button>
      </div>
      <ImportDialog
        open={openImport}
        onOpenChange={setOpenImport}
        translationKey="Finance.Companies"
        downloadImportTemplate={downloadCompaniesCsvTemplate}
      />
      <AddCompanyDialog open={openAddCompany} setOpen={setOpenAddCompany} />
    </div>
  );
}

export default CompaniesHeader;
