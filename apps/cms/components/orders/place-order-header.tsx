/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import PageTitle from "../page-title";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import { UploadIcon } from "@workspace/ui/lucide-react";
import { ImportDialog } from "../import-dialog";
import {
  downloadOrdersCsvTemplate,
  validatePlaceOrderCsv,
} from "@/lib/csvUtils";
import { toast } from "@workspace/ui/sonner";
import { useCartStore } from "@/lib/store/cart";
import AlertConfirmationDialog from "../alert-confirmation-dialog";

function PlaceOrderHeader() {
  const [openImport, setOpenImport] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const t = useTranslations("Orders.PlaceOrder");
  const ct = useTranslations("Common");
  const addToCart = useCartStore((state) => state.addToCart);

  const validate = async (file: File) => {
    const data = await validatePlaceOrderCsv(file);
    console.log("validate", data);
    if (data.length === 0) {
      toast.error(t("error.invalidFile"));
      return;
    }

    setProducts(data);
    setOpenImport(false);
    setShowConfirmation(true);
  };

  const onSubmit = async () => {
    products.map((item) => {
      addToCart(item.product, item.price, item.quantity);
    });

    setShowConfirmation(false);
    setOpenImport(false);
  };

  return (
    <div className="flex justify-between items-center flex-wrap space-y-4">
      <PageTitle title={t("title")} description={t("description")} />
      <Button onClick={() => setOpenImport(true)}>
        <UploadIcon className="mr-2 w-4 h-4" />
        {ct("uploadCSV")}
      </Button>

      <ImportDialog
        open={openImport}
        onOpenChange={setOpenImport}
        translationKey="Products"
        downloadImportTemplate={downloadOrdersCsvTemplate}
        validate={(file: File) => validate(file)}
      />

      <AlertConfirmationDialog
        open={showConfirmation}
        setOpen={setShowConfirmation}
        onConfirm={onSubmit}
        title={t("alert.title")}
        description={t("alert.description")}
      />
    </div>
  );
}

export default PlaceOrderHeader;
