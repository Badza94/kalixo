"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatDistanceToNow } from "@workspace/ui/lib/date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { MoreHorizontal, Edit, UserX, Ban } from "@workspace/ui/lucide-react";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar?: string;
}

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
}

function TeamMembersTable({ teamMembers }: TeamMembersTableProps) {
  const t = useTranslations("Finance.Companies");
  const ct = useTranslations("Common");
  const locale = useLocale();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">{ct("active")}</Badge>;
      case "pending":
        return <Badge variant="warning">{ct("pending")}</Badge>;
      case "inactive":
        return <Badge variant="destructive">{ct("inactive")}</Badge>;
      default:
        return <Badge variant="outline">{ct("unknown")}</Badge>;
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return ct("never");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("teamMembers")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>{t("fullName")}</TableHead>
                  <TableHead>{ct("email")}</TableHead>
                  <TableHead>{ct("country")}</TableHead>
                  <TableHead>{ct("role")}</TableHead>
                  <TableHead>{ct("status")}</TableHead>
                  <TableHead>{t("lastLogin")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => {
                  const regionNames = new Intl.DisplayNames([locale], {
                    type: "region",
                  });
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={member.avatar}
                              alt={`${member.firstName} ${member.lastName}`}
                            />
                            <AvatarFallback>
                              {getInitials(member.firstName, member.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {member.firstName} {member.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-muted-foreground">
                          {member.email}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <CircleFlag
                            className="h-4 w-4"
                            countryCode={member.countryCode.toLowerCase()}
                          />
                          <span>{regionNames.of(member.countryCode)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="capitalize">{ct(member.role)}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(member.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-muted-foreground">
                          {getRelativeTime(member.lastLogin)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
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
                              {ct("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ban className="mr-2 h-4 w-4" />
                              {t("suspend")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <UserX className="mr-2 h-4 w-4" />
                              {t("revokeAccess")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default TeamMembersTable;
