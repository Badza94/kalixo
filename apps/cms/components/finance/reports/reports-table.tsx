"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatDate } from "@workspace/ui/lib/date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { MoreHorizontal, Eye, Download } from "@workspace/ui/lucide-react";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import DynamicPagination from "@/components/dynamic-pagination";
import ViewReportDialog from "./view-report-dialog";
import DownloadReportDialog from "./download-report-dialog";

export interface Report {
  id: string;
  reportNumber: string;
  name: string;
  description: string;
  date: string;
  type: "sales" | "transactions" | "balance" | "inventory";
  status: "completed" | "processing" | "pending" | "failed";
  requestedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  period: string;
  filters: string[];
  products: {
    id: string;
    name: string;
    image: string;
    brand: string;
    countryCode: string;
    currencyCode: string;
    price: number;
    category: string;
    sales: number;
    revenue: number;
    margin: number;
  }[];
}

interface ReportsTableProps {
  reports: Report[];
  initialPage: number;
  totalPages: number;
  initialLimit: string;
}

export default function ReportsTable({
  reports,
  initialPage,
  totalPages,
  initialLimit,
}: ReportsTableProps) {
  const t = useTranslations("Finance.Reports");
  const rt = useTranslations("Finance.Reports.table");

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const getStatusBadge = (status: Report["status"]) => {
    const variants = {
      completed: "default" as const,
      processing: "secondary" as const,
      pending: "outline" as const,
      failed: "destructive" as const,
    };

    const labels = {
      completed: t("statuses.completed"),
      processing: t("statuses.processing"),
      pending: t("statuses.pending"),
      failed: t("statuses.failed"),
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleDownloadReport = (report: Report) => {
    setSelectedReport(report);
    setDownloadDialogOpen(true);
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">{rt("noReportsFound")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[515px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{rt("reportNumber")}</TableHead>
                  <TableHead>{rt("name")}</TableHead>
                  <TableHead className="min-w-[250px]">
                    {rt("description")}
                  </TableHead>
                  <TableHead>{rt("date")}</TableHead>
                  <TableHead>{rt("type")}</TableHead>
                  <TableHead>{rt("status")}</TableHead>
                  <TableHead>{rt("requestedBy")}</TableHead>
                  <TableHead>{rt("period")}</TableHead>
                  <TableHead>{rt("filters")}</TableHead>
                  <TableHead>{rt("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="py-8">
                      {report.reportNumber}
                    </TableCell>
                    <TableCell>{report.name} </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="max-w-[250px] truncate">
                              {report.description}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[300px]">
                              {report.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(report.date), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {report.requestedBy.firstName}{" "}
                        {report.requestedBy.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>
                      {report.filters.map((filter) => (
                        <Badge
                          key={filter}
                          variant="secondary"
                          className="mr-2"
                        >
                          {filter}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {rt("viewReport")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {rt("downloadReport")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <DynamicPagination
            currentPage={initialPage || 1}
            totalPages={totalPages}
            initialLimit={initialLimit}
          />
        </CardFooter>
      </Card>

      <ViewReportDialog
        report={selectedReport}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <DownloadReportDialog
        report={selectedReport}
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
      />
    </>
  );
}
