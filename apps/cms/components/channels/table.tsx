/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

import { useTranslations } from "next-intl";

import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import {
  ExternalLink,
  MoreHorizontal,
  CheckCircle,
  FileText,
  XCircle,
  Edit,
  Trash2,
} from "@workspace/ui/lucide-react";

import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import DynamicPagination from "@/components/dynamic-pagination";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useRouter } from "next/navigation";

function ChannelsTable({
  channels,
  initialLimit,
  initialPage,
  totalPages,
}: {
  channels: any[];
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}) {
  const t = useTranslations("Channels.table");
  const tActions = useTranslations("Channels.actions");
  const router = useRouter();

  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);

  const handleSelectChannel = (channelId: number, checked: boolean) => {
    if (checked) {
      setSelectedChannels([...selectedChannels, channelId]);
    } else {
      setSelectedChannels(selectedChannels.filter((id) => id !== channelId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedChannels(channels.map((channel) => channel.id));
    } else {
      setSelectedChannels([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSetStatus = (
    channelId: number,
    status: "active" | "draft" | "inactive"
  ) => {
    // TODO: Implement status update logic
    console.log(`Setting channel ${channelId} to ${status}`);
  };

  const handleEdit = (channelId: number) => {
    // TODO: Navigate to edit page
    console.log(`Editing channel ${channelId}`);
    router.push(`/channels/${channelId}?edit=true`);
  };

  const handleDelete = (channelId: number) => {
    // TODO: Implement delete logic with confirmation
    console.log(`Deleting channel ${channelId}`);
  };

  return (
    <Card>
      <CardContent>
        <ScrollArea className="h-full w-full">
          <Table suppressHydrationWarning>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="w-16">
                  <Checkbox
                    checked={
                      channels.length > 0 &&
                      selectedChannels.length === channels.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("url")}</TableHead>
                <TableHead>{t("location")}</TableHead>
                <TableHead>{t("currency")}</TableHead>
                <TableHead>{t("language")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => {
                return (
                  <TableRow key={channel.id}>
                    <TableCell className="w-16 py-8">
                      <Checkbox
                        checked={selectedChannels.includes(channel.id)}
                        onCheckedChange={(checked) =>
                          handleSelectChannel(channel.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="w-16">{channel.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4 rounded-full size-8">
                          <AvatarImage
                            src={channel.logoUrl as string}
                            alt={channel.name as string}
                          />
                          <AvatarFallback className="rounded-full">
                            {channel.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{channel.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{channel.channelType}</Badge>
                    </TableCell>

                    <TableCell className="truncate max-w-[250px] text-muted-foreground">
                      {channel.description}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm">
                          {channel.channelUrl}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CircleFlag
                          countryCode={channel.defaultLocation.toLowerCase()}
                          className="h-4 w-4"
                        />
                        <span>{channel.defaultLocation}</span>
                      </div>
                    </TableCell>

                    <TableCell>{channel.defaultCurrency}</TableCell>

                    <TableCell>
                      {channel.defaultLanguage.toUpperCase()}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          channel.status === "active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {channel.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(channel.createdAt)}
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
                            <span className="sr-only">
                              {tActions("openMenu")}
                            </span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleSetStatus(channel.id, "active")
                            }
                            disabled={channel.status === "active"}
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            {tActions("setActive")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSetStatus(channel.id, "draft")}
                            disabled={channel.status === "draft"}
                          >
                            <FileText className="mr-2 h-4 w-4 text-yellow-600" />
                            {tActions("setDraft")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSetStatus(channel.id, "inactive")
                            }
                            disabled={channel.status === "inactive"}
                          >
                            <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                            {tActions("setInactive")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(channel.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {tActions("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(channel.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tActions("delete")}
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
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicPagination
          currentPage={initialPage || 1}
          totalPages={totalPages}
          initialLimit={initialLimit}
        />
      </CardFooter>
    </Card>
  );
}

export default ChannelsTable;
