"use client";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { MoreHorizontal, Edit, Trash2 } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import DynamicPagination from "@/components/dynamic-pagination";
import { useState } from "react";

type Role = {
  id: number;
  roleName: string;
  description: string;
  type: string;
  permissions: string[];
  status: string;
  createdAt: string;
};

interface RolesTableProps {
  roles: Role[];
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}

function RolesTable({
  roles,
  initialPage,
  initialLimit,
  totalPages,
}: RolesTableProps) {
  const t = useTranslations("Settings.Roles.table");
  const tDialog = useTranslations("Settings.Roles.deleteDialog");
  const tTypes = useTranslations("Settings.Roles.roleTypes");
  const tStatuses = useTranslations("Settings.Roles.statuses");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      inactive: "secondary",
      draft: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>{tStatuses(status)}</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      // TODO: Implement actual delete logic here
      console.log("Deleting role:", roleToDelete);

      // For now, just close the dialog
      setDeleteDialogOpen(false);
      setRoleToDelete(null);

      // In a real implementation, you would:
      // 1. Call an API to delete the role
      // 2. Update the roles list
      // 3. Show success/error message
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  return (
    <>
      <Card>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-370px)] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>{t("roleName")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("permissions")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("createdAt")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t("noRolesFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-muted/50">
                      <TableCell className="py-4">
                        <div className="font-medium">{role.roleName}</div>
                      </TableCell>
                      <TableCell className="py-4 max-w-xs">
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {role.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tTypes(role.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {t("permissionCount", {
                            count: role.permissions.length,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(role.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(role.createdAt)}
                        </span>
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(role)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tDialog("title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tDialog("description", {
                roleName: roleToDelete?.roleName || "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              {tDialog("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tDialog("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RolesTable;
