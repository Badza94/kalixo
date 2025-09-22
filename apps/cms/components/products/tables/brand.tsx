"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, PencilIcon, Trash2 } from "@workspace/ui/lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useState } from "react";
import AddBrandDialog from "../dialogs/add-brand";
import EditBrandDialog from "../dialogs/edit-brand";
import DeleteBrandDialog from "../dialogs/delete-brand";
import { useTranslations } from "next-intl";

export type TBrand = {
  label: string;
  logoUrl: string;
  iconUrl?: string | null;
  value: string;
};

function BrandTable({ brands }: { brands: TBrand[] }) {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<TBrand | undefined>(
    undefined
  );

  const onEdit = (brand: TBrand) => {
    setSelectedBrand(brand);
    // Handle edit action
    console.log("Edit brand:", brand);

    // the timeout is there so the dropdown menu closes before the dialog opens
    // otherwise the dialog will be behind the dropdown menu
    // and there will be pointer events issues
    // this is a workaround for a known issue with the dropdown menu
    setTimeout(() => {
      setOpen(true);
    }, 100);
  };

  const onDelete = (brand: TBrand) => {
    // Handle delete action
    console.log("Delete brand:", brand);
    setSelectedBrand(brand);
    setTimeout(() => {
      setOpenDelete(true);
    }, 100);
  };

  const handleAddSuccess = (values: unknown) => {
    // Handle success action
    console.log("Brand added successfully: ", values);
  };

  const handleAddCancel = () => {
    // Handle cancel action
    setOpen(false);
    console.log("Brand addition cancelled");
  };

  const handleEditSuccess = (values: unknown) => {
    // Handle edit success action
    console.log("Brand edited successfully: ", values);
    setOpen(false);
    setSelectedBrand(undefined);
  };

  const handleDelete = () => {
    // Handle delete action
    console.log("Brand deleted successfully: ", selectedBrand);
    setOpenDelete(false);
    setSelectedBrand(undefined);
  };

  const handleDeleteCancel = () => {
    // Handle cancel action
    setOpenDelete(false);
    console.log("Brand deletion cancelled");
    setSelectedBrand(undefined);
  };

  const t = useTranslations("Products.Attributes");
  const ct = useTranslations("Common");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("Brands.title")}</CardTitle>
            <CardDescription>{t("Brands.description")}</CardDescription>
          </div>
          <AddBrandDialog
            onSuccess={handleAddSuccess}
            onCancel={handleAddCancel}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table className="table-fixed w-full overflow-x-auto whitespace-normal">
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>{ct("name")}</TableHead>
                <TableHead>{ct("logo")}</TableHead>
                <TableHead>{ct("icon")}</TableHead>
                <TableHead className="text-right">{ct("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.value}>
                  <TableCell className="font-medium">{brand.label}</TableCell>
                  <TableCell>
                    <Image
                      src={brand.logoUrl}
                      alt={brand.label}
                      className="h-8 w-8"
                      width={32}
                      height={32}
                    />
                  </TableCell>
                  <TableCell>
                    <Image
                      src={brand.iconUrl || "/placeholder.svg"}
                      alt={brand.label}
                      className="h-8 w-8"
                      width={32}
                      height={32}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{ct("openMenu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-background border shadow-lg"
                      >
                        <DropdownMenuItem onClick={() => onEdit(brand)}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          {ct("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(brand)}>
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          {ct("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      {selectedBrand && (
        <EditBrandDialog
          onSuccess={handleEditSuccess}
          onCancel={handleAddCancel}
          open={open}
          setOpen={setOpen}
          brand={selectedBrand}
        />
      )}
      {openDelete && (
        <DeleteBrandDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          brand={selectedBrand}
          handleDelete={handleDelete}
          handleCancel={handleDeleteCancel}
        />
      )}
    </Card>
  );
}

export default BrandTable;
