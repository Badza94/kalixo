/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Info,
  FileText,
  BookText,
  RefreshCcw,
  Download,
} from "@workspace/ui/lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ProductCodeModal } from "./product-code-modal";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { TermsConditionsModal } from "./terms-conditions-modal";
import { RedemptionInstructionsModal } from "./redemption-instructions-modal";
import { toast } from "@workspace/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
function OrderDeliveryTable({ products }: { products: any[] }) {
  const t = useTranslations("OrderDelivery");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    name: string;
    transactionId: string;
    serialNumber: string;
    platform: string;
  } | null>(null);
  const [selectedTerms, setSelectedTerms] = useState<string | null>(null);
  const [selectedInstructions, setSelectedInstructions] = useState<
    string | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "processing":
        return "warning";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleReorder = (productId: string) => {
    console.log(productId);
    toast.success(t("toast.reorderSuccess", { id: productId }));
  };

  const handleReorderSelected = () => {
    console.log(selectedProducts);
    toast.success(t("toast.reorderSelectedSuccess"));
  };

  return (
    <>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  50% {t("progress")}
                </p>
                <Progress value={50} className="w-24" />
              </div>
              <div>
                <Button variant="secondary">
                  <Download className="w-4 h-4" />
                  {t("exportCsv")}
                </Button>
              </div>
              {selectedProducts.length > 0 && (
                <div>
                  <Button variant="secondary" onClick={handleReorderSelected}>
                    <RefreshCcw className="w-4 h-4" />
                    {t("reorderSelected")}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              onClick={() => setSelectedStatus("all")}
              size="sm"
            >
              {t("status.all")}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 bg-foreground/10 text-foreground border-foreground/1",
                  selectedStatus === "all" && "bg-secondary"
                )}
              >
                {2}
              </Badge>
            </Button>
            <Button
              variant={selectedStatus === "delivered" ? "default" : "outline"}
              onClick={() => setSelectedStatus("delivered")}
              size="sm"
            >
              {t("status.delivered")}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 bg-foreground/10 text-foreground border-foreground/1",
                  selectedStatus === "delivered" && "bg-secondary"
                )}
              >
                {2}
              </Badge>
            </Button>
            <Button
              variant={selectedStatus === "processing" ? "default" : "outline"}
              onClick={() => setSelectedStatus("processing")}
              size="sm"
            >
              {t("status.processing")}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 bg-foreground/10 text-foreground border-foreground/1",
                  selectedStatus === "processing" && "bg-secondary"
                )}
              >
                {2}
              </Badge>
            </Button>
            <Button
              variant={selectedStatus === "pending" ? "default" : "outline"}
              onClick={() => setSelectedStatus("pending")}
              size="sm"
            >
              {t("status.pending")}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 bg-foreground/10 text-foreground border-foreground/1",
                  selectedStatus === "pending" && "bg-secondary"
                )}
              >
                {2}
              </Badge>
            </Button>
            <Button
              variant={selectedStatus === "failed" ? "default" : "outline"}
              onClick={() => setSelectedStatus("failed")}
              size="sm"
            >
              {t("status.failed")}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 bg-foreground/10 text-foreground border-foreground/1",
                  selectedStatus === "failed" && "bg-secondary"
                )}
              >
                {1}
              </Badge>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[515px] w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        products.length > 0 &&
                        selectedProducts.length === products.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t("table.image")}</TableHead>
                  <TableHead>{t("table.productName")}</TableHead>
                  <TableHead>{t("table.productId")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={50}
                        height={50}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadge(product.orderStatus)}
                        className="capitalize"
                      >
                        {t(`status.${product.orderStatus}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {product.orderStatus === "delivered" && (
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedProduct({
                                  name: product.name,
                                  code: product.code || "XXXX-XXXX-XXXX",
                                })
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t("actions.revealCode")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedTransaction({
                                name: product.name,
                                transactionId:
                                  product.transactionDetails?.transactionId ||
                                  "N/A",
                                serialNumber:
                                  product.transactionDetails?.serialNumber ||
                                  "N/A",
                                platform: product.platform || "N/A",
                              })
                            }
                          >
                            <Info className="h-4 w-4 mr-2" />
                            {t("actions.transactionDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedTerms(product.tnc)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {t("actions.termsAndConditions")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedInstructions(
                                product.redemptionInstructions
                              )
                            }
                          >
                            <BookText className="h-4 w-4 mr-2" />
                            {t("actions.redemptionInstructions")}
                          </DropdownMenuItem>
                          {product.orderStatus === "failed" && (
                            <DropdownMenuItem
                              onClick={() => handleReorder(product.id)}
                            >
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              {t("actions.reorder")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <ProductCodeModal
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        productName={selectedProduct?.name || ""}
        code={selectedProduct?.code || ""}
      />

      <TransactionDetailsModal
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
        productName={selectedTransaction?.name || ""}
        transactionId={selectedTransaction?.transactionId || ""}
        serialNumber={selectedTransaction?.serialNumber || ""}
        platform={selectedTransaction?.platform || ""}
      />

      <TermsConditionsModal
        open={!!selectedTerms}
        onOpenChange={(open) => !open && setSelectedTerms(null)}
        termsAndConditions={selectedTerms || ""}
      />

      <RedemptionInstructionsModal
        open={!!selectedInstructions}
        onOpenChange={(open) => !open && setSelectedInstructions(null)}
        instructions={selectedInstructions || ""}
      />
    </>
  );
}

export default OrderDeliveryTable;
