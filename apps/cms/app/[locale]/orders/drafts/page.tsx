import DraftTable from "@/components/orders/draft-table";
import PageTitle from "@/components/page-title";
import { buttonVariants } from "@workspace/ui/components/button";
import { PlusIcon } from "@workspace/ui/lucide-react";
import Link from "next/link";
import React from "react";

function Drafts() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap space-y-4">
        <PageTitle title="Drafts" description="Manage your draft orders" />
        <Link
          href="/orders/place-order"
          className={buttonVariants({
            variant: "default",
          })}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Order
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <DraftTable />
        </div>
      </div>
    </div>
  );
}

export default Drafts;
