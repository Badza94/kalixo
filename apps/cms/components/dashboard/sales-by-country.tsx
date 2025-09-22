import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Progress } from "@workspace/ui/components/progress";
import { CircleFlag } from "@workspace/ui/lib/react-circle-flags";
import { useTranslations } from "next-intl";

type TCountry = {
  name: string;
  countryCode: string;
  sales: number;
  progress: number;
  amount: number;
};

function SalesByCountry({ countries }: { countries: TCountry[] }) {
  const t = useTranslations("Dashboard.SalesByCountry");
  return (
    <Card className="h-[480px]">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[380px] pr-4">
          <div className="space-y-4">
            {countries.map((country) => (
              <div key={country.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleFlag
                      className="h-4 w-4"
                      countryCode={country.countryCode.toLowerCase()}
                    />
                    <p className="text-sm font-medium">{country.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {country.sales}%
                    </p>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(country.amount)}
                    </p>
                  </div>
                </div>
                <Progress value={country.progress} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default SalesByCountry;
