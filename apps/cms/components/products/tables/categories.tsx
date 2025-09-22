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
// import CategoryForm from "../forms/attribute";
import AttributesTable from "./attributes";
import AttributeForm from "../forms/attribute";

export type TCategoryType = {
  id: number;
  name: string;
  iconUrl?: string;
};

interface ProductTypeTableProps {
  categories: TCategoryType[];
}

const CategoryTable: React.FC<ProductTypeTableProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectData, setSelectedType] = useState<TCategoryType | undefined>(
    undefined
  );
  const [openDelete, setOpenDelete] = useState(false);

  const onEdit = (category: TCategoryType) => {
    setSelectedType(category);
    // Handle edit action
    console.log("Edit category:", category);

    // the timeout is there so the dropdown menu closes before the dialog opens
    // otherwise the dialog will be behind the dropdown menu
    // and there will be pointer events issues
    // this is a workaround for a known issue with the dropdown menu
    setTimeout(() => {
      setOpenEdit(true);
    }, 100);
  };

  const onDelete = (category: TCategoryType) => {
    // Handle delete action
    console.log("Delete category:", category);
    setSelectedType(category);
    setTimeout(() => {
      setOpenDelete(true);
    }, 100);
  };

  const handleAddSuccess = (values: unknown) => {
    // Handle success action
    console.log("category added successfully: ", values);
  };

  const handleAddCancel = () => {
    // Handle cancel action
    setOpen(false);
    setOpenEdit(false);
    console.log("category addition cancelled");
  };

  const handleDelete = () => {
    // Handle delete action
    console.log("category deleted successfully: ", selectData);
    setOpenDelete(false);
    setSelectedType(undefined);
  };

  const handleDeleteCancel = () => {
    // Handle cancel action
    setOpenDelete(false);
    console.log("category deletion cancelled");
    setSelectedType(undefined);
  };

  const t = useTranslations("Products.Attributes.Category");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>

          <AddDialog
            actionTitle={t("addCategory")}
            title={t("addNewCategoryTitle")}
            description={t("addNewCategoryDescription")}
            open={open}
            setOpen={setOpen}
          >
            <AttributeForm
              onSubmit={handleAddSuccess}
              onCancel={handleAddCancel}
              onOpenChange={setOpen}
              translationKey="Category"
            />
          </AddDialog>
        </div>
      </CardHeader>
      <CardContent>
        <AttributesTable
          data={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>

      {selectData && (
        <EditDialog
          open={openEdit}
          setOpen={setOpenEdit}
          title={t("editCategory")}
          description={t("editCategoryDescription")}
        >
          <AttributeForm
            data={selectData}
            onSubmit={handleAddSuccess}
            onCancel={handleAddCancel}
            onOpenChange={setOpen}
            translationKey="Category"
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

export default CategoryTable;
