import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "./companies-table";
import { useLocale, useTranslations } from "next-intl";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { formatCurrency } from "@workspace/ui/lib/utils";

type CompanyCardProps = {
  id: string;
  image: string;
  status: string;
  countryCode: string;
  country: string;
  currency: string;
  insights: {
    totalSales: number;
    itemsSold: number;
  };
  checked: boolean;
  companyName: string;
  onCheckedChange: (checked: boolean) => void;
};

function CompanyCard({
  id,
  image,
  companyName,
  status,
  countryCode,
  country,
  currency,
  insights,
  checked,
  onCheckedChange,
}: CompanyCardProps) {
  const router = useRouter();
  const statT = useTranslations("Status");
  const t = useTranslations("Finance.Companies");

  const locale = useLocale();
  const regionNames = new Intl.DisplayNames([locale], {
    type: "region",
  });
  return (
    <Card
      onClick={() => router.push(`/finance/companies/${id}`)}
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

        <div className="h-64 3xl:h-80 bg-muted/20 relative overflow-hidden">
          <Image
            src={image ? image : "/placeholder.svg"}
            alt={companyName}
            fill
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex justify-between items-center">
          {getStatusBadge(status, statT)}
          <div className="flex items-center gap-2">
            <CircleFlag
              countryCode={countryCode.toLowerCase()}
              className="w-4 h-4"
            />
            <p className="text-xs">{regionNames.of(countryCode) || country}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-0 text-base line-clamp-2">
            {companyName}
          </h3>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <span className="text-xs text-muted-foreground">ID: {id}</span>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {t("totalSales")}
          </span>
          {formatCurrency(insights.totalSales / 100, currency, locale)}
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {t("itemsSold")}
          </span>
          {insights.itemsSold}
        </div>
      </CardFooter>
    </Card>
  );
}

export default CompanyCard;
