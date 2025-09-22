"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "@workspace/ui/lib/recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ChartConfig, ChartContainer } from "@workspace/ui/components/chart";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { useTranslations } from "next-intl";

type BrandData = {
  brandId: string;
  name: string;
  percentage: number;
  color: string;
  iconUrl: string | null;
};

const createChartConfig = (brands: BrandData[]) => {
  const config: Record<string, { label: string; color: string }> = {};

  brands.forEach((brand) => {
    const key = brand.brandId;
    config[key] = {
      label: brand.name,
      color: brand.color,
    };
  });

  return config as ChartConfig;
};

export default function BrandChart({ data }: { data: BrandData[] }) {
  const t = useTranslations("Dashboard.SalesPerBrand");
  const chartConfig = createChartConfig(data);

  const topBrands = data.slice(0, 3);
  const otherBrands = data.slice(3);
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3">
        {topBrands.map((brand) => (
          <div
            key={brand.brandId}
            className="col-span-1 flex flex-col justify-center items-center"
          >
            <div className="text-muted-foreground mb-1">
              {brand.name.charAt(0)}
            </div>
            <div className="h-[200px] aspect-square max-h-[200px]">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[200px]"
              >
                <RadialBarChart
                  data={[{ ...brand, value: brand.percentage }]}
                  startAngle={90}
                  endAngle={90 - (360 * brand.percentage) / 100}
                  innerRadius={80}
                  outerRadius={120}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    // polarRadius={[86, 74]}
                    polarRadius={[88, 72]}
                  />
                  <RadialBar
                    dataKey="value"
                    background
                    cornerRadius={0}
                    fill={brand.color}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-xl font-bold"
                              >
                                {parseInt(brand.percentage.toString())}%
                              </tspan>
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </div>
            <div className="font-semibold text-lg">{brand.name}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="space-y-4 w-full">
          <Separator orientation="horizontal" className="h-[1px] bg-border" />

          {otherBrands.map((brand) => (
            <div
              key={brand.brandId}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 flex items-center justify-center">
                  <Avatar>
                    <AvatarImage src={brand.iconUrl ?? ""} alt={brand.name} />
                    <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="font-medium">{brand.name}</span>
              </div>
              <span className="font-medium">
                {parseInt(brand.percentage.toString())}%
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
