"use client";
import PageTitle from "@/components/page-title";
import { buttonVariants } from "@workspace/ui/components/button";
import { Plus } from "@workspace/ui/lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

function OrderHeader() {
  const t = useTranslations("Orders");

  return (
    <div className="flex justify-between flex-wrap space-y-4">
      <PageTitle title={t("title")} description={t("description")} />

      <div className="flex gap-4 items-center">
        <Link
          href="/orders/place-order"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2" />
          {t("PlaceOrder.title")}
        </Link>
      </div>
    </div>
  );
}

export default OrderHeader;
