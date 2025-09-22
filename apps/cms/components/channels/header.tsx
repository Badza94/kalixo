"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { DownloadIcon, UploadIcon } from "@workspace/ui/lucide-react";
import { PlusIcon } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ImportDialog } from "../import-dialog";
import {
  downloadChannelsCsvTemplate,
  validateChannelsCsv,
} from "@/lib/csvUtils";

function ChannelsHeader() {
  const t = useTranslations("Channels");
  const [openImport, setOpenImport] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline">
        <DownloadIcon className="w-4 h-4 mr-2" />
        {t("export")}
      </Button>
      <Button variant="outline" onClick={() => setOpenImport(true)}>
        <UploadIcon className="w-4 h-4 mr-2" />
        {t("import")}
      </Button>
      <Link
        href="/channels/new"
        className={buttonVariants({ variant: "default" })}
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        {t("addChannel")}
      </Link>

      <ImportDialog
        open={openImport}
        onOpenChange={setOpenImport}
        translationKey="Channels"
        downloadImportTemplate={downloadChannelsCsvTemplate}
        validate={validateChannelsCsv}
      />
    </div>
  );
}

export default ChannelsHeader;
