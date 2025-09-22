"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Edit, Trash2 } from "@workspace/ui/lucide-react";
import { toast } from "@workspace/ui/sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Badge } from "@workspace/ui/components/badge";
import DynamicPagination from "@/components/dynamic-pagination";
import AlertConfirmationDialog from "@/components/alert-confirmation-dialog";

interface Market {
  id: number;
  marketName: string;
  marketType: "country" | "region";
  countries: string[];
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
  numberFormat: string;
  vatRate: number;
}

interface MarketsTableProps {
  markets: Market[];
  initialPage: number;
  initialLimit: string;
  totalPages: number;
}

function MarketsTable({
  markets,
  initialPage,
  initialLimit,
  totalPages,
}: MarketsTableProps) {
  const t = useTranslations("Settings.Markets");
  const ct = useTranslations("Common");

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleEdit = (market: Market) => {
    // TODO: Implement edit functionality
    console.log("Edit market:", market);
    toast.info(`${ct("edit")} ${market.marketName}`);
  };

  const handleDeleteClick = (market: Market) => {
    setSelectedMarket(market);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedMarket) {
      // TODO: Implement delete functionality
      console.log("Delete market:", selectedMarket);
      toast.success(`${selectedMarket.marketName} ${ct("deleted")}`);
      setShowDeleteConfirmation(false);
      setSelectedMarket(null);
    }
  };

  const getMarketTypeBadge = (type: "country" | "region") => {
    return (
      <Badge variant={type === "country" ? "default" : "secondary"}>
        {t(`marketTypes.${type}`)}
      </Badge>
    );
  };

  const formatVatRate = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>
            {t("table.description", {
              count: markets.length,
              total: markets.length,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[515px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>{t("table.market")}</TableHead>
                  <TableHead>{t("table.type")}</TableHead>
                  <TableHead>{t("table.currency")}</TableHead>
                  <TableHead>{t("table.vatRate")}</TableHead>
                  <TableHead>{t("table.numberFormat")}</TableHead>
                  <TableHead className="w-[70px]">{ct("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markets.length > 0 ? (
                  markets.map((market) => (
                    <TableRow key={market.id}>
                      <TableCell className="font-medium py-4">
                        {market.marketName}
                      </TableCell>
                      <TableCell>
                        {getMarketTypeBadge(market.marketType)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {market.currencySymbol}
                          </span>
                          <span>{market.currencyCode}</span>
                          <span className="text-muted-foreground text-sm">
                            ({market.currencyName})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">
                          {formatVatRate(market.vatRate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {market.numberFormat}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">{ct("openMenu")}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(market)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {ct("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(market)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {ct("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {t("table.noMarketsFound")}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <DynamicPagination
            currentPage={initialPage || 1}
            totalPages={totalPages || 1}
            initialLimit={initialLimit}
          />
        </CardFooter>
      </Card>

      <AlertConfirmationDialog
        open={showDeleteConfirmation}
        setOpen={setShowDeleteConfirmation}
        onConfirm={handleDeleteConfirm}
        title={t("deleteDialog.title")}
        description={t("deleteDialog.description", {
          marketName: selectedMarket?.marketName || "",
        })}
      />
    </>
  );
}

export default MarketsTable;
