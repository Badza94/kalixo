"use client";
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
  CardHeader,
  CardFooter,
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
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/sonner";
import {
  MoreHorizontal,
  Play,
  Edit,
  Copy,
  Download,
  Calendar,
  User,
  Users,
} from "@workspace/ui/lucide-react";
import { Progress } from "@workspace/ui/components/progress";

interface Segment {
  id: string;
  name: string;
  description: string;
  tags: string[];
  customerPercentage: number;
  createdAt: string;
  createdBy: string;
  status: "active" | "inactive";
  conditions: string[];
  sqlQuery: string;
}

interface SegmentsTableProps {
  segments: Segment[];
  initialPage: number;
  initialLimit: string;
  totalPages: number;
}

function SegmentsTable({
  segments,
  initialPage,
  initialLimit,
  totalPages,
}: SegmentsTableProps) {
  const t = useTranslations("Customers.Segments.table");
  const router = useRouter();
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">{t("statuses.active")}</Badge>;
      case "inactive":
        return <Badge variant="secondary">{t("statuses.inactive")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const handleUseSegment = (segment: Segment) => {
    // Redirect to marketing/campaigns with segment data
    router.push(`/marketing/campaigns?segmentId=${segment.id}`);
    toast.success(t("actions.useSegmentSuccess", { name: segment.name }));
  };

  const handleEdit = (segment: Segment) => {
    // TODO: Implement edit functionality
    console.log("Editing segment:", segment);
    toast.success(t("actions.editSuccess", { name: segment.name }));
  };

  const handleDuplicate = (segment: Segment) => {
    // TODO: Implement duplicate functionality
    console.log("Duplicating segment:", segment);
    toast.success(t("actions.duplicateSuccess", { name: segment.name }));
  };

  const handleExport = (segment: Segment) => {
    // Create and download SQL file
    const sqlContent = segment.sqlQuery;
    const blob = new Blob([sqlContent], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${segment.name.toLowerCase().replace(/\s+/g, "_")}_query.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t("actions.exportSuccess", { name: segment.name }));
  };

  const handleDeleteClick = (segment: Segment) => {
    setSelectedSegment(segment);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSegment) {
      // TODO: Implement delete functionality
      console.log("Deleting segment:", selectedSegment);
      toast.success(t("actions.deleteSuccess", { name: selectedSegment.name }));
      setShowDeleteConfirmation(false);
      setSelectedSegment(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{t("title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[515px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>{t("columns.name")}</TableHead>
                  <TableHead>{t("columns.description")}</TableHead>
                  <TableHead>{t("columns.tags")}</TableHead>
                  <TableHead>{t("columns.customerPercentage")}</TableHead>
                  <TableHead>{t("columns.createdAt")}</TableHead>
                  <TableHead>{t("columns.createdBy")}</TableHead>
                  <TableHead>{t("columns.status")}</TableHead>
                  <TableHead>{t("columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segments.length > 0 ? (
                  segments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {segment.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="truncate" title={segment.description}>
                          {segment.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {segment.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {segment.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{segment.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {formatPercentage(segment.customerPercentage)}
                          <Progress
                            value={segment.customerPercentage}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(segment.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {segment.createdBy}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(segment.status)}</TableCell>
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
                              onClick={() => handleUseSegment(segment)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              {t("actions.useSegment")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(segment)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t("actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(segment)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              {t("actions.duplicate")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExport(segment)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              {t("actions.export")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(segment)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              {t("actions.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">
                          {t("noSegments")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("noSegmentsDescription")}
                        </p>
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
            currentPage={initialPage}
            totalPages={totalPages}
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
          segmentName: selectedSegment?.name || "",
        })}
      />
    </>
  );
}

export default SegmentsTable;
