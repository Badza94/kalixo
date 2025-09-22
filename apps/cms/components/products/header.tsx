"use client";
import PageTitle from "@/components/page-title";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Download, Plus, UploadIcon } from "@workspace/ui/lucide-react";
import Link from "next/link";
import { ImportDialog } from "../import-dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { downloadProductCsvTemplate } from "@/lib/csvUtils";

function ProductHeader() {
  const [openImport, setOpenImport] = useState(false);
  const t = useTranslations("Products");
  const ct = useTranslations("Common");

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
        <Link
          href="/products/create"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2" />
          {t("addProduct")}
        </Link>
      </div>
      <ImportDialog
        open={openImport}
        onOpenChange={setOpenImport}
        translationKey="Products"
        downloadImportTemplate={downloadProductCsvTemplate}
      />
    </div>
  );
}

export default ProductHeader;
