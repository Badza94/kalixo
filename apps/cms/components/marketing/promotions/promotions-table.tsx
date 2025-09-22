/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "@workspace/ui/lib/date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@workspace/ui/sonner";
import {
  MoreHorizontal,
  Edit,
  Pause,
  Square,
} from "@workspace/ui/lucide-react";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ArrowUpDown } from "@workspace/ui/lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import DynamicPagination from "@/components/dynamic-pagination";
import { BulkPromotionActionDialog } from "./bulk-promotion-action-dialog";

interface Channel {
  id: number;
  label: string;
  value: string;
  resellerCode: string;
  image: string;
}

export interface Promotion {
  id: number;
  global: boolean;
  channels: Channel[];
  couponCode: string;
  description: string;
  discountType: "percent" | "amount" | "buyget";
  percentValue: string;
  amountValue: string;
  buyValue: string;
  getValue: string;
  appliesTo: "all" | "categories" | "products";
  specificCategories: string[];
  specificProducts: string[];
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  nonExpiringCoupon: boolean;
  localTimeTracking: boolean;
  limitTotalUses: boolean;
  totalUsesLimit: string;
  limitOneUsePerAccount: boolean;
  minimumRequirement: "none" | "amount" | "quantity";
  minimumPurchaseAmount: string;
  minimumQuantityOfItems: string;
  status: "active" | "scheduled" | "paused" | "expired" | "terminated";
  createdAt: string;
  usedCount: number;
}

function PromotionsTable({
  promotions,
  initialSort,
  initialLimit,
  initialPage,
  totalPages,
}: {
  promotions: Promotion[];
  initialSort: string;
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}) {
  const [sort, setSort] = useState(initialSort);
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [showChannelsDialog, setShowChannelsDialog] = useState(false);
  const [selectedPromotionForChannels, setSelectedPromotionForChannels] =
    useState<Promotion | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const st = useTranslations("Sort");
  const t = useTranslations("Common");
  const pt = useTranslations("Marketing.Promotions.table");
  const pa = useTranslations("Marketing.Promotions.actions");
  const pc = useTranslations("Marketing.Promotions.channels");
  const ps = useTranslations("Marketing.Promotions.status");
  const pd = useTranslations("Marketing.Promotions.discountTypes");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPromotions(
        promotions.map((promotion) => promotion.id.toString())
      );
    } else {
      setSelectedPromotions([]);
    }
  };

  const handleSelectPromotion = (promotionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPromotions((prev) => [...prev, promotionId]);
    } else {
      setSelectedPromotions((prev) => prev.filter((id) => id !== promotionId));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "scheduled":
        return "warning";
      case "paused":
        return "secondary";
      case "expired":
        return "outline";
      case "terminated":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getDiscountTypeDisplay = (promotion: Promotion) => {
    switch (promotion.discountType) {
      case "percent":
        return pd("percentOff", { value: promotion.percentValue });
      case "amount":
        return pd("amountOff", { value: promotion.amountValue });
      case "buyget":
        return pd("buyGet", {
          buy: promotion.buyValue,
          get: promotion.getValue,
        });
      default:
        return promotion.discountType;
    }
  };

  const getUsageDisplay = (promotion: Promotion) => {
    if (!promotion.limitTotalUses) {
      return pt("unlimited");
    }
    return `${promotion.usedCount}/${promotion.totalUsesLimit}`;
  };

  const getEndDateDisplay = (promotion: Promotion) => {
    if (promotion.nonExpiringCoupon) {
      return pt("nonExpiring");
    }
    try {
      const endDateTime = new Date(`${promotion.endDate}T${promotion.endTime}`);
      return format(endDateTime, "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const handleEdit = (promotionId: number) => {
    // Add edit parameter to search params
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("edit", promotionId.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const handlePause = (promotionId: number) => {
    console.log("Pause promotion:", promotionId);
    // Find the promotion to get its coupon code for the toast
    const promotion = promotions.find((p) => p.id === promotionId);
    const couponCode = promotion?.couponCode || `#${promotionId}`;

    // TODO: Implement actual pause functionality
    toast.success(pa("pauseSuccess", { couponCode }));
  };

  const handleTerminate = (promotionId: number) => {
    console.log("Terminate promotion:", promotionId);
    // Find the promotion to get its coupon code for the toast
    const promotion = promotions.find((p) => p.id === promotionId);
    const couponCode = promotion?.couponCode || `#${promotionId}`;

    // TODO: Implement actual terminate functionality
    toast.success(pa("terminateSuccess", { couponCode }));
  };

  const handleChannelCellClick = (promotion: Promotion) => {
    setSelectedPromotionForChannels(promotion);
    setShowChannelsDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className={cn("w-[180px] justify-between")}>
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4 opacity-70" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{st("newest")}</SelectItem>
                <SelectItem value="oldest">{st("oldest")}</SelectItem>
                <SelectItem value="name_asc">{st("name_asc")}</SelectItem>
                <SelectItem value="name_desc">{st("name_desc")}</SelectItem>
              </SelectContent>
            </Select>
            {selectedPromotions.length > 0 && (
              <BulkPromotionActionDialog
                selectedPromotions={selectedPromotions}
                onAction={(promotionIds, newStatus) => {
                  console.log(
                    "Updating promotions:",
                    promotionIds,
                    "to status:",
                    newStatus
                  );
                  // TODO: Implement actual status update logic
                }}
              />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-16">
                    <Checkbox
                      checked={
                        promotions.length > 0 &&
                        selectedPromotions.length === promotions.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{pt("channel")}</TableHead>
                  <TableHead>{pt("couponCode")}</TableHead>
                  <TableHead>{pt("description")}</TableHead>
                  <TableHead>{pt("type")}</TableHead>
                  <TableHead>{pt("usage")}</TableHead>
                  <TableHead>{pt("status")}</TableHead>
                  <TableHead>{pt("endDate")}</TableHead>
                  <TableHead className="w-16">{pt("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.length > 0 ? (
                  promotions.map((promotion) => (
                    <TableRow key={promotion.id} className="cursor-pointer">
                      <TableCell className="py-8">
                        <Checkbox
                          checked={selectedPromotions.includes(
                            promotion.id.toString()
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectPromotion(
                              promotion.id.toString(),
                              checked as boolean
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChannelCellClick(promotion);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {promotion.channels.length > 0 && (
                            <>
                              <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage
                                  src={promotion.channels[0]?.image}
                                  alt={promotion.channels[0]?.label}
                                />
                                <AvatarFallback className="rounded-full">
                                  {promotion.channels[0]?.label.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {promotion.channels[0]?.label}
                                </span>
                                {promotion.channels.length > 1 && (
                                  <span className="text-xs text-muted-foreground hover:text-primary">
                                    +{promotion.channels.length - 1} more
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {promotion.couponCode}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="max-w-[200px] truncate">
                          {promotion.description}
                        </span>
                      </TableCell>
                      <TableCell>{getDiscountTypeDisplay(promotion)}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {getUsageDisplay(promotion)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(promotion.status)}
                        >
                          {ps(promotion.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {getEndDateDisplay(promotion)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="sr-only">{t("openMenu")}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(promotion.id);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {pa("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePause(promotion.id);
                              }}
                            >
                              <Pause className="mr-2 h-4 w-4" />
                              {pa("pause")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTerminate(promotion.id);
                              }}
                              className="text-destructive"
                            >
                              <Square className="mr-2 h-4 w-4" />
                              {pa("terminate")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-muted-foreground">
                          {pt("noPromotionsFound")}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {totalPages > 1 && (
            <div className="mt-4">
              <DynamicPagination
                currentPage={initialPage}
                totalPages={totalPages}
                initialLimit={initialLimit}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Channels Dialog */}
      <Dialog open={showChannelsDialog} onOpenChange={setShowChannelsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {pc("dialogTitle", {
                couponCode: selectedPromotionForChannels?.couponCode || "",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{pc("channel")}</TableHead>
                  <TableHead>{pc("resellerCode")}</TableHead>
                  <TableHead className="w-16">{pc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPromotionForChannels?.channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-full">
                          <AvatarImage
                            src={channel.image}
                            alt={channel.label}
                          />
                          <AvatarFallback className="rounded-full">
                            {channel.label.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{channel.label}</span>
                          <span className="text-sm text-muted-foreground">
                            ID: {channel.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{channel.resellerCode}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">{t("openMenu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              if (selectedPromotionForChannels?.id) {
                                handleEdit(selectedPromotionForChannels.id);
                              }
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {pa("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (selectedPromotionForChannels?.id) {
                                handlePause(selectedPromotionForChannels.id);
                              }
                            }}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            {pa("pause")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (selectedPromotionForChannels?.id) {
                                handleTerminate(
                                  selectedPromotionForChannels.id
                                );
                              }
                            }}
                            className="text-destructive"
                          >
                            <Square className="mr-2 h-4 w-4" />
                            {pa("terminate")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PromotionsTable;
