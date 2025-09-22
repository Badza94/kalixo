/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@workspace/ui/lib/utils";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { ArrowUpDown } from "@workspace/ui/lucide-react";

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
import ViewToggle from "@/components/view-toggle";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { useRouter } from "next/navigation";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { BulkProductActionDialog } from "../../bulk-action";
import ProductCard from "../card";
import { ProductStatusBadge } from "../../status-badge";
import DynamicPagination from "@/components/dynamic-pagination";

function ProductTable({
  products,
  initialSort,
  initialLimit,
  initialView,
  initialPage,
  totalPages,
}: {
  products: any[];
  initialSort: string;
  initialLimit: string;
  initialView: "list" | "cards";
  initialPage: number;
  totalPages: number;
}) {
  const [currentView, onViewChange] = useState<"list" | "cards">(initialView);
  const [sort, setSort] = useState(initialSort);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const t = useTranslations("Common");
  const st = useTranslations("Sort");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    // Get current search params to preserve filters from Filters component
    const currentParams = new URLSearchParams(window.location.search);

    // Update only the parameters this component controls
    if (sort && sort !== "newest") {
      currentParams.set("sort", sort);
    } else {
      currentParams.delete("sort");
    }

    if (currentView && currentView !== "list") {
      currentParams.set("view", currentView);
    } else {
      currentParams.delete("view");
    }

    router.push(`/products?${currentParams.toString()}`, { scroll: false });
  }, [router, sort, currentView]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
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
          {selectedProducts.length > 0 && (
            <BulkProductActionDialog
              selectedData={selectedProducts}
              translationKey="Products"
            />
          )}
        </div>

        <ViewToggle currentView={currentView} onViewChange={onViewChange} />
      </CardHeader>
      <CardContent>
        {currentView === "list" ? (
          <ScrollArea>
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-16">
                    <Checkbox
                      checked={
                        products.length > 0 &&
                        selectedProducts.length === products.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">{t("id")}</TableHead>
                  <TableHead className="w-16">{t("image")}</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("country")}</TableHead>
                  <TableHead>{t("brand")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("value")}</TableHead>
                  <TableHead>{t("commission")}</TableHead>
                  <TableHead>{t("buyingPrice")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const regionNames = new Intl.DisplayNames([locale], {
                    type: "region",
                  });
                  return (
                    <TableRow
                      key={product.id}
                      onClick={() =>
                        router.push(`/${locale}/products/${product.id}`)
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) =>
                            handleSelectProduct(product.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="py-8">{product.id}</TableCell>
                      <TableCell>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={128}
                          height={128}
                          className="rounded-md"
                          placeholder="blur"
                          blurDataURL={product.image}
                          loading="lazy"
                        />
                      </TableCell>

                      <TableCell className="max-w-[300px] whitespace-normal">
                        {product.name}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CircleFlag
                            className="h-4 w-4"
                            countryCode={product.countryCode.toLowerCase()}
                          />
                          {regionNames.of(product.countryCode.toUpperCase())}
                        </div>
                      </TableCell>

                      <TableCell>{product.brand}</TableCell>

                      <TableCell>{product.type}</TableCell>

                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: product.currencyCode,
                        }).format(Number(product.price))}
                      </TableCell>

                      <TableCell>{product.commission}</TableCell>

                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: product.currencyCode,
                        }).format(Number(product.price))}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <ProductStatusBadge status={product.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="col-span-12 lg:col-span-4 xl:col-span-3 3xl:col-span-2"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  countryCode={product.countryCode}
                  brand={product.brand}
                  type={product.type}
                  status={product.status}
                  currencyCode={product.currencyCode}
                  price={product.price}
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) =>
                    handleSelectProduct(product.id, checked as boolean)
                  }
                />
              </div>
            ))}
          </div>
        )}
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

export default ProductTable;
