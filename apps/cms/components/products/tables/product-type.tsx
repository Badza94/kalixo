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
// import ProductTypeForm from "../forms/product-type";
import AttributesTable from "./attributes";
import AttributeForm from "../forms/attribute";

export type TProductType = {
  id: number;
  name: string;
  iconUrl?: string;
};

interface ProductTypeTableProps {
  productTypes: TProductType[];
}

const ProductTypeTable: React.FC<ProductTypeTableProps> = ({
  productTypes,
}) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedType, setSelectedType] = useState<TProductType | undefined>(
    undefined
  );
  const [openDelete, setOpenDelete] = useState(false);

  const onEdit = (productType: TProductType) => {
    setSelectedType(productType);
    // Handle edit action
    console.log("Edit productType:", productType);

    // the timeout is there so the dropdown menu closes before the dialog opens
    // otherwise the dialog will be behind the dropdown menu
    // and there will be pointer events issues
    // this is a workaround for a known issue with the dropdown menu
    setTimeout(() => {
      setOpenEdit(true);
    }, 100);
  };

  const onDelete = (productType: TProductType) => {
    // Handle delete action
    console.log("Delete productType:", productType);
    setSelectedType(productType);
    setTimeout(() => {
      setOpenDelete(true);
    }, 100);
  };

  const handleAddSuccess = (values: unknown) => {
    // Handle success action
    console.log("productType added successfully: ", values);
  };

  const handleAddCancel = () => {
    // Handle cancel action
    setOpen(false);
    setOpenEdit(false);
    console.log("productType addition cancelled");
  };

  const handleDelete = () => {
    // Handle delete action
    console.log("productType deleted successfully: ", selectedType);
    setOpenDelete(false);
    setSelectedType(undefined);
  };

  const handleDeleteCancel = () => {
    // Handle cancel action
    setOpenDelete(false);
    console.log("productType deletion cancelled");
    setSelectedType(undefined);
  };

  const t = useTranslations("Products.Attributes.ProductTypes");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>

          <AddDialog
            actionTitle={t("addProductType")}
            title={t("addNewProductTypeTitle")}
            description={t("addNewProductTypeDescription")}
            open={open}
            setOpen={setOpen}
          >
            <AttributeForm
              onSubmit={handleAddSuccess}
              onCancel={handleAddCancel}
              onOpenChange={setOpen}
              translationKey="ProductTypes"
            />
          </AddDialog>
        </div>
      </CardHeader>
      <CardContent>
        <AttributesTable
          data={productTypes}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>

      {selectedType && (
        <EditDialog
          open={openEdit}
          setOpen={setOpenEdit}
          title={t("editProductType")}
          description={t("editProductTypeDescription")}
        >
          <AttributeForm
            data={selectedType}
            onSubmit={handleAddSuccess}
            onCancel={handleAddCancel}
            onOpenChange={setOpen}
            translationKey="ProductTypes"
          />
        </EditDialog>
      )}

      {openDelete && (
        <DeleteDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          productType={selectedType}
          handleDelete={handleDelete}
          handleCancel={handleDeleteCancel}
        />
      )}
    </Card>
  );
};

export default ProductTypeTable;
