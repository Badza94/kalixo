import { Card, CardContent } from "@workspace/ui/components/card";
import { ComponentType, createElement } from "react";
import * as LucideIcons from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";

export const Stats = ({
  stats,
}: {
  stats: {
    title: string;
    value: string;
    icon: string;
    change: string;
    trend: number[];
  }[];
}) => {
  const t = useTranslations("Dashboard.Stats");

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        return (
          <Card
            key={index}
            className="relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-lg group"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-muted-foreground/50 dark:bg-input rounded-md w-10 h-10 flex items-center justify-center">
                  {stat.icon &&
                    typeof stat.icon === "string" &&
                    ((
                      LucideIcons as unknown as Record<
                        string,
                        ComponentType<{ className?: string }>
                      >
                    )[stat.icon] !== undefined ? (
                      createElement(
                        (
                          LucideIcons as unknown as Record<
                            string,
                            ComponentType<{ className?: string }>
                          >
                        )[stat.icon]!,
                        {
                          className: "h-4 w-4 text-primary",
                        }
                      )
                    ) : (
                      <span>{stat.icon}</span>
                    ))}
                </div>
                <h3 className="text-lg font-semibold">{t(stat.title)}</h3>
              </div>

              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-success">{stat.change}</p>
                </div>
                {/* Line trend chart */}
                <div className="h-12 w-24 relative">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={stat.trend
                        .map(
                          (point, i) =>
                            `${(i * 100) / (stat.trend.length - 1)},${50 - point * 3.5}`
                        )
                        .join(" ")}
                      fill="none"
                      stroke="var(--chart-2)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
