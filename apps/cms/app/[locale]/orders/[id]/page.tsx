import PauseContinueOrder from "@/components/orders/singleOrder/pase-continue";
import PageTitle from "@/components/page-title";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@workspace/ui/components/table";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Send,
  DollarSign,
  Package,
  TrendingUp,
  Percent,
} from "@workspace/ui/lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import order from "@/data/singleOrderData.json";
import Image from "next/image";
import { cn, formatCurrency } from "@workspace/ui/lib/utils";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { cookies } from "next/headers";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import FullRiskAnalysis from "@/components/orders/singleOrder/full-risk-analysis";
import OrderDeliveryTable from "@/components/orders/singleOrder/order-delivery-table";
import { Timeline, TimelineEntry } from "@workspace/ui/components/timeline";
import timelineData from "@/data/timeline-fake.json";

async function SingleOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const t = await getTranslations("Orders.SingleOrder");
  const ct = await getTranslations("Common");

  const cookieStore = await cookies();
  const locale = cookieStore.get?.("NEXT_LOCALE")?.value || "en";

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus.toLowerCase()) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CreditCard className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
    }
  };

  const getInvoiceStatusColor = (status: string) => {
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

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return <Badge variant="success">{t("lowRisk")}</Badge>;
      case "medium":
        return <Badge variant="warning">{t("mediumRisk")}</Badge>;
      case "high":
        return <Badge variant="destructive">{t("highRisk")}</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <PageTitle
            title={`#ORD-${id}`}
            description={`${t("orderDetails")}: ${id}`}
          />
        </div>
        <PauseContinueOrder />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <div className="md:col-span-2 flex flex-col space-y-4 h-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("orderItems")}</CardTitle>
                <span className="text-muted-foreground text-base">
                  {order.orderItems.length} {ct("items")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[515px] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead className="w-1/5">{t("image")}</TableHead>
                      <TableHead className="w-1/5">
                        {t("productName")}
                      </TableHead>
                      <TableHead className="w-1/5">{t("quantity")}</TableHead>
                      <TableHead className="w-1/5">{t("price")}</TableHead>
                      <TableHead className="w-1/5">{t("totalPrice")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">
                              {ct("platform")}: {item.platform}
                            </span>{" "}
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {formatCurrency(
                            Number(item.price) / 100,
                            item.currencyCode,
                            item.countryCode
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            Number(item.totalPrice) / 100,
                            item.currencyCode,
                            item.countryCode
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="sticky bottom-0 bg-card">
                    <TableRow>
                      <TableCell colSpan={4}>
                        {t("totalQuantity")}: {order.totalQuantity}
                      </TableCell>
                      <TableCell>
                        {t("totalAmount")}:
                        {formatCurrency(
                          Number(order.totalAmount) / 100,
                          "EUR",
                          locale
                        )}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col items-stretch">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{t("riskAnalysis")}</CardTitle>
                  {getRiskLevelBadge(order.riskAnalysis.riskLevel)}
                </div>
                <FullRiskAnalysis riskAnalysis={order.riskAnalysis} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("ipAddress")}
                  </p>
                  <p className="font-medium">{order.riskAnalysis.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("paymentType")}
                  </p>
                  <p className="font-medium">
                    {order.riskAnalysis.paymentType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("3dsStatus")}
                  </p>
                  <Badge
                    variant={
                      order.riskAnalysis.threeDSStatus
                        ? "success"
                        : "destructive"
                    }
                    className="mt-1"
                  >
                    {order.riskAnalysis.threeDSStatus ? "Success" : "Failed"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("liabilityShift")}
                  </p>
                  <Badge
                    variant={
                      order.riskAnalysis.hasLiabilityShift
                        ? "success"
                        : "destructive"
                    }
                    className="mt-1"
                  >
                    {order.riskAnalysis.hasLiabilityShift
                      ? ct("yes")
                      : ct("no")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("riskScore")}
                  </p>
                  <p className="font-medium">
                    {order.riskAnalysis.riskScore}/100
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("returningCustomer")}
                  </p>
                  <Badge
                    variant={
                      order.riskAnalysis.isReturningCustomer
                        ? "success"
                        : "secondary"
                    }
                    className="mt-1"
                  >
                    {order.riskAnalysis.isReturningCustomer
                      ? ct("yes")
                      : ct("no")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col space-y-4 h-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>{ct("orderStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p className="text-muted-foreground">{ct("status")}</p>
                {getStatusBadge(order.orderStatus.status)}
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">{ct("payment")}</p>
                {getPaymentStatusBadge(order.orderStatus.paymentStatus)}
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">{ct("paymentTime")}</p>
                <Badge variant="outline">
                  {order.orderStatus.processingTime}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>{t("customerDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <p>
                    {order.customerDetails.firstName}
                    {order.customerDetails.lastName}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    ID: {order.customerDetails.id}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  className="underline underline-offset-4"
                  href={`mailto:${order.customerDetails.email}`}
                >
                  {order.customerDetails.email}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a
                  className="underline underline-offset-4"
                  href={`tel:${order.customerDetails.phone}`}
                >
                  {order.customerDetails.phone}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <a
                  className="underline underline-offset-4"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerDetails.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {order.customerDetails.address}
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>{t("invoice")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 justify-between">
                <span className="text-muted-foreground">
                  {t("invoiceNumber")}
                </span>
                {order.invoiceDetails.invoiceId}
              </div>
              <div className="flex items-center gap-4 justify-between">
                <span className="text-muted-foreground">{ct("status")}</span>
                <span
                  className={cn(
                    getInvoiceStatusColor(order.invoiceDetails.status),
                    "capitalize"
                  )}
                >
                  {order.invoiceDetails.status}
                </span>
              </div>
              <div className="flex items-center gap-4 w-full justify-between">
                <Link
                  href={`/finance/invoices/${order.invoiceDetails.invoiceId}`}
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                    }),
                    "flex-1"
                  )}
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Button variant="secondary" className="flex-1">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="secondary" className="flex-1">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>{t("orderInsights")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orderValue")}
                    </p>
                    <p className="font-semibold">
                      {formatCurrency(
                        Number(order.totalAmount) / 100,
                        "EUR",
                        locale
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-md">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {ct("items")}
                    </p>
                    <p className="font-semibold">
                      {order.totalItems} {ct("products")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-md">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="text-sm text-muted-foreground cursor-help">
                            {ct("margin")}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{ct("marginDescription")}</p>
                        </TooltipContent>
                      </Tooltip>
                      <p className="font-semibold">
                        {formatCurrency(Number(order.margin), "EUR", locale)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-md">
                    <Percent className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-sm text-muted-foreground cursor-help">
                          {ct("margin")} %
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{ct("marginPercentageDescription")}</p>
                      </TooltipContent>
                    </Tooltip>
                    <p className="font-semibold">{order.marginPercentage}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full">
        <OrderDeliveryTable products={order.orderItems} />
      </div>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>{t("orderTimeline")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline entries={timelineData as TimelineEntry[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SingleOrderPage;
