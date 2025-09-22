import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import Image from "next/image";
import { ProductStatusBadge } from "../status-badge";
import { Badge } from "@workspace/ui/components/badge";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

function ProductCard({
  id,
  name,
  image,
  countryCode,
  brand,
  price,
  type,
  status,
  currencyCode,
  checked,
  onCheckedChange,
}: {
  id: string;
  name: string;
  image: string;
  countryCode: string;
  brand: string;
  price: number;
  type: string;
  status: string;
  currencyCode: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const router = useRouter();
  const t = useTranslations("Common");
  const locale = useLocale();

  return (
    <Card
      onClick={() => router.push(`${locale}/products/${id}`)}
      className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group pt-0 gap-4"
    >
      <CardHeader className="px-0 py-0 relative">
        <div className="absolute top-2 left-4 z-10">
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="absolute top-2 right-4 z-10">
          <ProductStatusBadge status={status} />
        </div>

        <div className="h-64 3xl:h-80 bg-muted/20 relative overflow-hidden">
          <Image
            src={image ? image : "/placeholder.svg"}
            alt={name}
            fill
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            {type || t("unknown")}
          </Badge>
          <CircleFlag
            className="h-4 w-4"
            countryCode={countryCode.toLowerCase()}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-0 text-base line-clamp-2">{name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[60%]">
            {brand || t("noBrand")}
          </span>
          <span className="text-sm font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currencyCode,
            }).format(Number(price))}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">ID: {id}</span>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
