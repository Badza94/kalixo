"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "@workspace/ui/lib/date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Checkbox } from "@workspace/ui/components/checkbox";
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
  MoreHorizontal,
  Edit,
  Settings,
  Ban,
} from "@workspace/ui/lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";

interface Channel {
  id: number;
  label: string;
  value: string;
  resellerCode: string;
  image: string;
  tier: string;
  type: string;
  paymentTerms: string;
  nextInvoiceDate: string;
}

interface ChannelsTableProps {
  channels: Channel[];
}

function ChannelsTable({ channels }: ChannelsTableProps) {
  const t = useTranslations("Finance.Companies");
  const ct = useTranslations("Common");
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedChannels(channels.map((channel) => channel.id));
    } else {
      setSelectedChannels([]);
    }
  };

  const handleSelectChannel = (channelId: number, checked: boolean) => {
    if (checked) {
      setSelectedChannels([...selectedChannels, channelId]);
    } else {
      setSelectedChannels(selectedChannels.filter((id) => id !== channelId));
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "1":
        return <Badge variant="success">Tier 1</Badge>;
      case "2":
        return <Badge variant="warning">Tier 2</Badge>;
      case "3":
        return <Badge variant="destructive">Tier 3</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const isAllSelected = selectedChannels.length === channels.length;
  const isIndeterminate =
    selectedChannels.length > 0 && selectedChannels.length < channels.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("channels")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all channels"
                    {...(isIndeterminate && { "data-state": "indeterminate" })}
                  />
                </TableHead>
                <TableHead>{t("channel")}</TableHead>
                <TableHead>{t("tier")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("paymentTerms")}</TableHead>
                <TableHead>{t("nextInvoiceDate")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell className="py-8">
                    <Checkbox
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={(checked) =>
                        handleSelectChannel(channel.id, checked as boolean)
                      }
                      aria-label={`Select ${channel.label}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={channel.image} alt={channel.label} />
                        <AvatarFallback>
                          {channel.label.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{channel.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(channel.tier)}</TableCell>
                  <TableCell>{t(channel.type)}</TableCell>
                  <TableCell>{t(channel.paymentTerms)}</TableCell>
                  <TableCell>
                    {format(new Date(channel.nextInvoiceDate), "MMM d, yyyy")}
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
                          {ct("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          {ct("configure")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          {ct("disable")}
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
    </Card>
  );
}

export default ChannelsTable;
