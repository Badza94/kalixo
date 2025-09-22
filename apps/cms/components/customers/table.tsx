/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { ArrowUpDown } from "@workspace/ui/lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import ViewToggle from "@/components/view-toggle";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { BulkProductActionDialog } from "../bulk-action";
import CustomerCard from "./card";
import DynamicPagination from "../dynamic-pagination";

function CustomersTable({
  customers,
  initialSort,
  initialLimit,
  initialView,
  initialPage,
  totalPages,
}: {
  customers: any[];
  initialSort: string;
  initialLimit: string;
  initialView: "list" | "cards";
  initialPage: number;
  totalPages: number;
}) {
  const [currentView, onViewChange] = useState<"list" | "cards">(initialView);
  const [sort, setSort] = useState(initialSort);
  // const [limit, setLimit] = useState(initialLimit);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const st = useTranslations("Sort");
  const t = useTranslations("Common");

  const locale = useLocale();
  const router = useRouter();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomers = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, productId]);
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => id !== productId));
    }
  };

  useEffect(() => {
    // Get current search params to preserve filters from Filters component
    const currentParams = new URLSearchParams(window.location.search);

    // Update only the parameters this component controls
    if (sort && sort !== "newest") {
      currentParams.set("sort", sort);
    } else {
      currentParams.delete("sort");
    }

    if (currentView && currentView !== "list") {
      currentParams.set("view", currentView);
    } else {
      currentParams.delete("view");
    }

    router.push(`/customers?${currentParams.toString()}`, { scroll: false });
  }, [router, sort, currentView]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className={cn("w-[180px] justify-between")}>
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 opacity-70" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{st("newest")}</SelectItem>
              <SelectItem value="oldest">{st("oldest")}</SelectItem>
              <SelectItem value="name_asc">{st("name_asc")}</SelectItem>
              <SelectItem value="name_desc">{st("name_desc")}</SelectItem>
            </SelectContent>
          </Select>
          {selectedCustomers.length > 0 && (
            <BulkProductActionDialog
              selectedData={selectedCustomers}
              translationKey="Customers"
            />
          )}
        </div>

        <ViewToggle currentView={currentView} onViewChange={onViewChange} />
      </CardHeader>
      <CardContent>
        {currentView === "list" ? (
          <ScrollArea>
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-16">
                    <Checkbox
                      checked={
                        customers.length > 0 &&
                        selectedCustomers.length === customers.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">{t("id")}</TableHead>
                  <TableHead className="w-16">{t("image")}</TableHead>
                  <TableHead>{t("firstName")}</TableHead>
                  <TableHead>{t("lastName")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("country")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("channel")}</TableHead>
                  <TableHead>{t("lastLogin")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const regionNames = new Intl.DisplayNames([locale], {
                    type: "region",
                  });
                  return (
                    <TableRow
                      key={customer.id}
                      onClick={() => router.push(`/customers/${customer.id}`)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={(checked) =>
                            handleSelectCustomers(
                              customer.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="py-8">{customer.id}</TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8 rounded-full">
                          <AvatarImage
                            src={customer?.image as string}
                            alt={customer?.firstName as string}
                          />
                          <AvatarFallback className="rounded-full">
                            {`${customer?.firstName?.charAt(0)}${customer?.lastName?.charAt(0)}`}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>

                      <TableCell className="max-w-[300px] whitespace-normal">
                        {customer.firstName}
                      </TableCell>
                      <TableCell className="max-w-[300px] whitespace-normal">
                        {customer.lastName}
                      </TableCell>
                      <TableCell className="max-w-[300px] whitespace-normal">
                        {customer.email}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CircleFlag
                            className="h-4 w-4"
                            countryCode={customer.countryCode.toLowerCase()}
                          />
                          {regionNames.of(customer.countryCode.toUpperCase())}
                        </div>
                      </TableCell>

                      <TableCell>{customer.type}</TableCell>

                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Avatar className="h-4 w-4 rounded-full">
                            <AvatarImage
                              src={customer.defaultChannel.image as string}
                              alt={customer.defaultChannel.label as string}
                            />
                            <AvatarFallback className="rounded-full">
                              {customer.defaultChannel?.label?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {customer.defaultChannel.label}
                        </div>
                      </TableCell>

                      <TableCell>{customer.lastLogin || t("never")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="col-span-12 lg:col-span-4 xl:col-span-3 3xl:col-span-2"
              >
                <CustomerCard
                  id={customer.id}
                  firstName={customer.firstName}
                  lastName={customer.lastName}
                  image={customer.image}
                  countryCode={customer.countryCode}
                  type={customer.type}
                  email={customer.email}
                  channel={customer.defaultChannel}
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) =>
                    handleSelectCustomers(customer.id, checked as boolean)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <DynamicPagination
          currentPage={initialPage || 1}
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>
    </Card>
  );
}

export default CustomersTable;
