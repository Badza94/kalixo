/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useState } from "react";
import { ArrowUpDown } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
import { BulkOrderActionDialog } from "./bulk-action";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { useRouter } from "@/i18n/navigation";
import DynamicPagination from "../dynamic-pagination";

function OrdersTable({
  orders,
  initialSort,
  initialLimit,
  initialPage,
  totalPages,
}: {
  orders: any[];
  initialSort: string;
  initialLimit: string;
  initialPage: number;
  totalPages: number;
}) {
  const st = useTranslations("Sort");
  const ct = useTranslations("Common");
  const router = useRouter();
  const [sort, setSort] = useState(initialSort);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "processing":
        return "warning";
      case "cancelled":
        return "destructive";
      case "refunded":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
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
          {selectedOrders.length > 0 && (
            <BulkOrderActionDialog
              selectedData={selectedOrders}
              translationKey="Orders"
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
                      orders.length > 0 &&
                      selectedOrders.length === orders.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{ct("orderId")}</TableHead>
                <TableHead>{ct("date")}</TableHead>
                <TableHead>{ct("customer")}</TableHead>
                <TableHead>{ct("country")}</TableHead>
                <TableHead>{ct("channel")}</TableHead>
                <TableHead>{ct("paymentRef")}</TableHead>
                <TableHead>{ct("amount")}</TableHead>
                <TableHead>{ct("items")}</TableHead>
                <TableHead>{ct("paymentStatus")}</TableHead>
                <TableHead>{ct("orderStatus")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell className="w-16 py-8">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders((prev) => [...prev, order.id]);
                        } else {
                          setSelectedOrders((prev) =>
                            prev.filter((id) => id !== order.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    {order.customer.firstName} {order.customer.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CircleFlag
                        className="h-5 w-5"
                        countryCode={order.country.code.toLowerCase()}
                      />
                      <span>{order.country.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4 rounded-full size-8">
                        <AvatarImage
                          src={order.channel?.image as string}
                          alt={order.channel?.resellerCode as string}
                        />
                        <AvatarFallback className="rounded-full">
                          {order.channel?.resellerCode?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{order.channel?.resellerCode}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.paymentRef}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency,
                    }).format(order.amount)}
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell
                    className={cn(
                      getPaymentStatusColor(order.paymentStatus),
                      "capitalize"
                    )}
                  >
                    {order.paymentStatus}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getOrderStatusColor(order.orderStatus)}
                    >
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default OrdersTable;
