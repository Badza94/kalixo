/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { useState, useEffect } from "react";
import { cn, formatCurrency } from "@workspace/ui/lib/utils";

import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Trash2,
} from "@workspace/ui/lucide-react";
import ViewToggle from "@/components/view-toggle";
import { useLocale, useTranslations } from "next-intl";
import DynamicPagination from "@/components/dynamic-pagination";
import { format } from "@workspace/ui/lib/date-fns";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import AlertConfirmationDialog from "@/components/alert-confirmation-dialog";
import { toast } from "@workspace/ui/sonner";
import { useRouter } from "next/navigation";
import CompanyCard from "./company-card";
import BulkCompanyActionDialog from "./bulk-action";

export const getStatusBadge = (status: string, key: any) => {
  switch (status) {
    case "approved":
      return <Badge variant="success">{key("approved")}</Badge>;
    case "pending":
      return <Badge variant="warning">{key("pending")}</Badge>;
    case "rejected":
      return <Badge variant="destructive">{key("rejected")}</Badge>;
    case "suspended":
      return <Badge variant="warning">{key("suspended")}</Badge>;
    case "under_review":
      return <Badge variant="outline">{key("under_review")}</Badge>;
    default:
      return <Badge variant="default">{key("unknown")}</Badge>;
  }
};

function CompaniesTable({
  companies,
  initialSort,
  initialLimit,
  initialView,
  initialPage,
  totalPages,
}: {
  companies: any[];
  initialSort: string;
  initialLimit: string;
  initialView: "list" | "cards";
  initialPage: number;
  totalPages: number;
}) {
  const [currentView, onViewChange] = useState<"list" | "cards">(initialView);
  const [sort, setSort] = useState(initialSort);
  const [selectedCompanies, setSelectedCompanies] = useState<
    { id: string; companyName: string }[]
  >([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const st = useTranslations("Sort");
  const statT = useTranslations("Status");
  const t = useTranslations("Finance.Companies");
  const ct = useTranslations("Common");
  const bt = useTranslations("BulkAction");
  const locale = useLocale();
  const router = useRouter();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCompanies(
        companies.map((company) => ({
          id: company.id,
          companyName: company.companyName,
        }))
      );
    } else {
      setSelectedCompanies([]);
    }
  };

  const onSubmit = () => {
    // Handle the action submission logic here
    console.log(
      `Performing action delete on companies:`,
      selectedCompanies.map((company) => company.companyName)
    );
    toast.success(
      bt(`Statuses.success`, {
        action: ct("delete"),
        count: selectedCompanies.length,
      })
    );
    setShowConfirmation(false);
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

    if (currentView && sort) {
      router.push(`/finance/companies?${currentParams.toString()}`, {
        scroll: false,
      });
    }
  }, [router, sort, currentView]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className={cn("w-[180px] justify-between")}>
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 opacity-70" />
                <SelectValue placeholder={ct("sortBy")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{st("newest")}</SelectItem>
              <SelectItem value="oldest">{st("oldest")}</SelectItem>
              <SelectItem value="name_asc">{st("name_asc")}</SelectItem>
              <SelectItem value="name_desc">{st("name_desc")}</SelectItem>
            </SelectContent>
          </Select>
          {selectedCompanies.length > 0 && (
            <BulkCompanyActionDialog selectedData={selectedCompanies} />
          )}
        </div>

        <ViewToggle currentView={currentView} onViewChange={onViewChange} />
      </CardHeader>
      <CardContent>
        {currentView === "list" ? (
          <ScrollArea className="h-[515px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-16">
                    <Checkbox
                      checked={
                        companies.length > 0 &&
                        selectedCompanies.length === companies.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>{t("companyName")}</TableHead>
                  <TableHead>{t("country")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("totalSales")}</TableHead>
                  <TableHead>{t("itemsSold")}</TableHead>
                  <TableHead>{t("createdAt")}</TableHead>
                  <TableHead>{ct("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => {
                  const regionNames = new Intl.DisplayNames([locale], {
                    type: "region",
                  });
                  return (
                    <TableRow
                      key={company.id}
                      onClick={() =>
                        router.push(`/finance/companies/${company.id}`)
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedCompanies.some(
                            (selected) => selected.id === company.id
                          )}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={() => {
                            if (
                              selectedCompanies.some(
                                (selected) => selected.id === company.id
                              )
                            ) {
                              setSelectedCompanies(
                                selectedCompanies.filter(
                                  (selected) => selected.id !== company.id
                                )
                              );
                            } else {
                              setSelectedCompanies([
                                ...selectedCompanies,
                                {
                                  id: company.id,
                                  companyName: company.companyName,
                                },
                              ]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="py-8">{company.id}</TableCell>
                      <TableCell>{company.companyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CircleFlag
                            countryCode={company.countryCode.toLowerCase()}
                            className="w-4 h-4"
                          />
                          {regionNames.of(company.countryCode) ||
                            company.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(company.status, statT)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          company.insights.totalSales / 100,
                          company.currency,
                          locale
                        )}
                      </TableCell>
                      <TableCell>{company.insights.itemsSold}</TableCell>
                      <TableCell>
                        {format(new Date(company.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/finance/companies/${company.id}?edit=true`
                                );
                              }}
                            >
                              <Edit className="w-4 h-4" />
                              {ct("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCompanies([
                                  {
                                    id: company.id,
                                    companyName: company.companyName,
                                  },
                                ]);
                                setShowConfirmation(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              {ct("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="col-span-12 lg:col-span-4 xl:col-span-3 3xl:col-span-2"
              >
                <CompanyCard
                  id={company.id}
                  image={company.image}
                  checked={selectedCompanies.some(
                    (selected) => selected.id === company.id
                  )}
                  onCheckedChange={() => {
                    if (
                      selectedCompanies.some(
                        (selected) => selected.id === company.id
                      )
                    ) {
                      setSelectedCompanies(
                        selectedCompanies.filter(
                          (selected) => selected.id !== company.id
                        )
                      );
                    } else {
                      setSelectedCompanies([
                        ...selectedCompanies,
                        {
                          id: company.id,
                          companyName: company.companyName,
                        },
                      ]);
                    }
                  }}
                  companyName={company.companyName}
                  status={company.status}
                  countryCode={company.countryCode}
                  country={company.country}
                  currency={company.currency}
                  insights={company.insights}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <DynamicPagination
          currentPage={initialPage || 1}
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>

      <AlertConfirmationDialog
        open={showConfirmation}
        setOpen={setShowConfirmation}
        onConfirm={onSubmit}
        title={bt("confirmAction")}
        description={bt("Customers.Actions.description", {
          name: selectedCompanies?.[0]?.companyName ?? "",
        })}
      />
    </Card>
  );
}

export default CompaniesTable;
