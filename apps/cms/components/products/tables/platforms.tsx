"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import EditDialog from "../dialogs/edit";
import DeleteDialog from "../dialogs/delete";
import { useTranslations } from "next-intl";
import AddDialog from "../dialogs/add";
import AttributesTable from "./attributes";
import AttributeForm from "../forms/attribute";

export type TPlatformType = {
  id: number;
  name: string;
  iconUrl?: string;
};

interface ProductTypeTableProps {
  platforms: TPlatformType[];
}

const PlatformTable: React.FC<ProductTypeTableProps> = ({ platforms }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectData, setSelectedType] = useState<TPlatformType | undefined>(
    undefined
  );
  const [openDelete, setOpenDelete] = useState(false);

  const onEdit = (Platform: TPlatformType) => {
    setSelectedType(Platform);
    // Handle edit action
    console.log("Edit Platform:", Platform);

    // the timeout is there so the dropdown menu closes before the dialog opens
    // otherwise the dialog will be behind the dropdown menu
    // and there will be pointer events issues
    // this is a workaround for a known issue with the dropdown menu
    setTimeout(() => {
      setOpenEdit(true);
    }, 100);
  };

  const onDelete = (Platform: TPlatformType) => {
    // Handle delete action
    console.log("Delete Platform:", Platform);
    setSelectedType(Platform);
    setTimeout(() => {
      setOpenDelete(true);
    }, 100);
  };

  const handleAddSuccess = (values: unknown) => {
    // Handle success action
    console.log("Platform added successfully: ", values);
  };

  const handleAddCancel = () => {
    // Handle cancel action
    setOpen(false);
    setOpenEdit(false);
    console.log("Platform addition cancelled");
  };

  const handleDelete = () => {
    // Handle delete action
    console.log("Platform deleted successfully: ", selectData);
    setOpenDelete(false);
    setSelectedType(undefined);
  };

  const handleDeleteCancel = () => {
    // Handle cancel action
    setOpenDelete(false);
    console.log("Platform deletion cancelled");
    setSelectedType(undefined);
  };

  const t = useTranslations("Products.Attributes.Platform");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>

          <AddDialog
            actionTitle={t("addPlatform")}
            title={t("addNewPlatformTitle")}
            description={t("addNewPlatformDescription")}
            open={open}
            setOpen={setOpen}
          >
            <AttributeForm
              onSubmit={handleAddSuccess}
              onCancel={handleAddCancel}
              onOpenChange={setOpen}
              translationKey="Platform"
            />
          </AddDialog>
        </div>
      </CardHeader>
      <CardContent>
        <AttributesTable data={platforms} onEdit={onEdit} onDelete={onDelete} />
      </CardContent>

      {selectData && (
        <EditDialog
          open={openEdit}
          setOpen={setOpenEdit}
          title={t("editPlatform")}
          description={t("editPlatformDescription")}
        >
          <AttributeForm
            data={selectData}
            onSubmit={handleAddSuccess}
            onCancel={handleAddCancel}
            onOpenChange={setOpen}
            translationKey="Platform"
          />
        </EditDialog>
      )}

      {openDelete && (
        <DeleteDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          productType={selectData}
          handleDelete={handleDelete}
          handleCancel={handleDeleteCancel}
        />
      )}
    </Card>
  );
};

export default PlatformTable;
