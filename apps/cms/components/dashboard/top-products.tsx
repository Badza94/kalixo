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
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight } from "@workspace/ui/lucide-react";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import Image from "next/image";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { useLocale, useTranslations } from "next-intl";

export interface TopProduct {
  id: number;
  name: string;
  quantity: number;
  countryCode: string;
  price: string;
  currency: string;
  ean: string;
  brand: string;
  totalSalesPrice: number;
  salesPercentage: string;
  image: string;
}

interface TopProductsProps {
  products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {
  const locale = useLocale();
  const tt = useTranslations("Dashboard.TopProducts");
  const t = useTranslations("Common");

  return (
    <Card className="h-[480px]">
      <CardHeader>
        <CardTitle>{tt("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[380px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="w-16">{t("image")}</TableHead>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("origin")}</TableHead>
                <TableHead>{t("brand")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("sales")}</TableHead>
                <TableHead>{t("performance")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const regionNames = new Intl.DisplayNames([locale], {
                  type: "region",
                });
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="aspect-square rounded-md"
                        placeholder="blur"
                        blurDataURL={product.image}
                        loading="lazy"
                      />
                    </TableCell>
                    <TableCell className="max-w-[300px] whitespace-normal">
                      <div className="space-y-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("id")}: {product.id} • {t("type")}: {product.brand}
                        </div>
                      </div>
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
                    <TableCell>
                      <span className="font-medium">{product.brand}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.quantity}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.totalSalesPrice)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          123%
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
