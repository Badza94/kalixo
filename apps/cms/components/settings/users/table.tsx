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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  UserCheck,
} from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "@workspace/ui/lib/date-fns";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import DynamicPagination from "@/components/dynamic-pagination";
import { useRouter } from "@/i18n/routing";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  companyId: string;
  role: string;
  status: string;
  lastActive: string | null;
  avatar: string;
  createdAt: string;
  relevantChannels: {
    id: number;
    label: string;
    value: string;
    resellerCode: string;
    image: string;
  }[];
};

interface UsersTableProps {
  users: User[];
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}

function UsersTable({
  users,
  initialPage,
  initialLimit,
  totalPages,
}: UsersTableProps) {
  const t = useTranslations("Settings.Users.table");
  const tf = useTranslations("Settings.Users.filters");
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      pending: "secondary",
      inactive: "outline",
      suspended: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {tf(`statuses.${status}`)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      superAdministrator: "destructive",
      administrator: "destructive",
      channelAdmin: "default",
      adminView: "outline",
      companyAdmin: "default",
      companyChannelAdmin: "secondary",
      partner: "secondary",
      vendor: "outline",
      agency: "outline",
    };

    return (
      <Badge variant={variants[role] || "outline"}>{tf(`types.${role}`)}</Badge>
    );
  };

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) {
      return "Never";
    }
    return formatDistanceToNow(new Date(lastActive), { addSuffix: true });
  };

  return (
    <Card>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-370px)] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("company")}</TableHead>
                <TableHead>{t("relevantChannels")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("lastActive")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {t("noUsersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    onClick={() => router.push(`/settings/users/${user.id}`)}
                  >
                    <TableCell className="py-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                          <AvatarFallback>
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2 items-center">
                        {user.relevantChannels.slice(0, 2).map((channel) => (
                          <Badge
                            key={channel.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {channel.label}
                          </Badge>
                        ))}
                        {user.relevantChannels.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{user.relevantChannels.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatLastActive(user.lastActive)}
                    </TableCell>
                    <TableCell className="text-right">
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
                            Edit
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
  );
}

export default UsersTable;
