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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import DynamicPagination from "@/components/dynamic-pagination";
import {
  MoreHorizontal,
  Edit,
  Pause,
  Trash2,
} from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { format } from "@workspace/ui/lib/date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@workspace/ui/sonner";

type ApiApplication = {
  id: string;
  name: string;
  url: string;
  environment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  apiKey?: string;
  description?: string;
};

const getStatusBadge = (status: string, t: (key: string) => string) => {
  switch (status) {
    case "active":
      return <Badge variant="success">{t("active")}</Badge>;
    case "paused":
      return <Badge variant="warning">{t("paused")}</Badge>;
    case "inactive":
      return <Badge variant="destructive">{t("inactive")}</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getEnvironmentBadge = (environment: string) => {
  switch (environment) {
    case "Production":
      return <Badge variant="default">{environment}</Badge>;
    case "Staging":
      return <Badge variant="warning">{environment}</Badge>;
    case "Development":
      return <Badge variant="secondary">{environment}</Badge>;
    default:
      return <Badge variant="outline">{environment}</Badge>;
  }
};

function ApplicationsTable({
  applications,
  initialLimit,
  initialPage,
  totalPages,
}: {
  applications: ApiApplication[];
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}) {
  const t = useTranslations("Settings.APISettings");
  const ct = useTranslations("Common");
  const st = useTranslations("Status");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEdit = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("edit", id);
    router.push(`?${params.toString()}`);
  };

  const handlePause = (id: string) => {
    console.log("Pause application:", id);
    toast.success(t("applicationPaused"));
    // TODO: Implement pause functionality
  };

  const handleDelete = (id: string) => {
    console.log("Delete application:", id);
    toast.success(t("applicationDeleted"));
    // TODO: Implement delete functionality
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("applications")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("applicationsDescription")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-450px)] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>{ct("name")}</TableHead>
                <TableHead>{t("url")}</TableHead>
                <TableHead>{t("environment")}</TableHead>
                <TableHead>{ct("status")}</TableHead>
                <TableHead>{t("dateCreated")}</TableHead>
                <TableHead>{t("lastUpdate")}</TableHead>
                <TableHead>{t("company")}</TableHead>
                <TableHead>{ct("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium py-8">
                      {application.name}
                    </TableCell>
                    <TableCell>
                      <a
                        href={application.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/80 hover:underline"
                      >
                        {application.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      {getEnvironmentBadge(application.environment)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status, st)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.updatedAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{application.company}</TableCell>
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
                            onClick={() => handleEdit(application.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {ct("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePause(application.id)}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            {ct("pause")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(application.id)}
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
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-muted-foreground">
                        {t("noApplicationsFound")}
                      </span>
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
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>
    </Card>
  );
}

export default ApplicationsTable;
