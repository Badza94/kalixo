"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
import {
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "@workspace/ui/lib/recharts";
import { Button } from "@workspace/ui/components/button";
import { DollarSign, Package } from "@workspace/ui/lucide-react";
import {
  type ChartConfig,
  ChartContainer,
} from "@workspace/ui/components/chart";
import { useTranslations } from "next-intl";

type TSalesData = {
  month: string;
  current: number;
  previous: number;
  items: number;
  previousItems: number;
};

const SalesChart = ({ data }: { data: TSalesData[] }) => {
  const t = useTranslations("Dashboard.SalesOverview");
  const sm = useTranslations("ShortMonths");
  const [activeView, setActiveView] = useState<"revenue" | "items">("revenue");

  const getYAxisFormatter = () => {
    if (activeView === "revenue") {
      return (value: number) => `$${value / 1000}k`;
    } else {
      return (value: number) => `${value}`;
    }
  };

  const chartConfig = {
    current: {
      label: t("currentPeriod"),
      color: "var(--chart-1)",
    },
    previous: {
      label: t("previousPeriod"),
      color: "var(--chart-2)",
    },
    items: {
      label: t("currentPeriodItems"),
      color: "var(--chart-1)",
    },
    previousItems: {
      label: t("previousPeriodItems"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const getTooltipFormatter = (value: number, name: string) => {
    const isCurrentPeriod = name.includes("Current");
    const color = isCurrentPeriod
      ? chartConfig.current.color
      : chartConfig.previous.color;

    if (activeView === "revenue") {
      return [
        <span key="value" style={{ color }}>
          ${value.toLocaleString()}
        </span>,
        <span key="name" className="text-muted-foreground">
          {name}
        </span>,
      ];
    } else {
      return [
        <span key="value" style={{ color }}>
          {value.toLocaleString()} items
        </span>,
        <span key="name" className="text-muted-foreground">
          {name}
        </span>,
      ];
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex items-center justify-between pb-0">
        <CardTitle>{t("title")}</CardTitle>
        <div className="flex bg-muted p-1 rounded-md">
          <Button
            variant={activeView === "revenue" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView("revenue")}
            className="rounded-md"
          >
            <DollarSign className="w-4 h-4" />
          </Button>
          <Button
            variant={activeView === "items" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView("items")}
            className="rounded-md"
          >
            <Package className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[360px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.current.color}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.current.color}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.previous.color}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.previous.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={getYAxisFormatter()}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{
                color: "var(--card-foreground)",
                fontWeight: "bold",
                marginBottom: "0.25rem",
              }}
              formatter={(value, name) =>
                getTooltipFormatter(value as number, name as string)
              }
              labelFormatter={(label) => sm(label)}
            />
            <Legend
              align="center"
              verticalAlign="top"
              height={36}
              fontSize={16}
              formatter={(value) => {
                return (
                  <span className="text-muted-foreground text-base">
                    {value}
                  </span>
                );
              }}
            />
            {activeView === "revenue" && (
              <Area
                type="monotone"
                name={chartConfig.current.label}
                dataKey="current"
                stroke={chartConfig.current.color}
                fill="url(#colorCurrent)"
                strokeWidth={2}
              />
            )}
            {activeView === "revenue" && (
              <Area
                type="monotone"
                name={chartConfig.previous.label}
                dataKey="previous"
                stroke={chartConfig.previous.color}
                fill="url(#colorPrevious)"
                strokeWidth={2}
                fillOpacity={0.3}
              />
            )}
            {activeView === "items" && (
              <Area
                type="monotone"
                name={chartConfig.items.label}
                dataKey="items"
                stroke={chartConfig.items.color}
                fill="url(#colorCurrent)"
                strokeWidth={2}
              />
            )}
            {activeView === "items" && (
              <Area
                type="monotone"
                name={chartConfig.previousItems.label}
                dataKey="previousItems"
                stroke={chartConfig.previousItems.color}
                fill="url(#colorPrevious)"
                strokeWidth={2}
                fillOpacity={0.3}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
