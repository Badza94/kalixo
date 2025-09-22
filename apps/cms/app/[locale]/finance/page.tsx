import PageTitle from "@/components/page-title";
import {
  CircleDollarSign,
  Building2,
  FileText,
  BarChart3,
  Receipt,
  DollarSign,
} from "@workspace/ui/lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

async function Finance() {
  const t = await getTranslations("Finance");

  const financeOptions = [
    {
      title: t("navigation.balance"),
      description: t("navigation.balanceDescription"),
      icon: CircleDollarSign,
      path: "/finance/balance",
    },
    {
      title: t("navigation.companies"),
      description: t("navigation.companiesDescription"),
      icon: Building2,
      path: "/finance/companies",
    },
    {
      title: t("navigation.invoices"),
      description: t("navigation.invoicesDescription"),
      icon: FileText,
      path: "/finance/invoices",
    },
    {
      title: t("navigation.pricingTable"),
      description: t("navigation.pricingTableDescription"),
      icon: DollarSign,
      path: "/finance/pricing-table",
    },
    {
      title: t("navigation.reports"),
      description: t("navigation.reportsDescription"),
      icon: BarChart3,
      path: "/finance/reports",
    },
    {
      title: t("navigation.transactions"),
      description: t("navigation.transactionsDescription"),
      icon: Receipt,
      path: "/finance/transactions",
    },
  ];

  return (
    <div className="space-y-4">
      <PageTitle title={t("title")} description={t("description")} />

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {financeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              href={option.path}
              key={option.title}
              className="flex w-full h-full"
            >
              <Card className="cursor-pointer hover:border-primary transition-colors w-full h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="bg-primary/10 w-fit p-2 rounded-lg">
                      <Icon className="h-6 w-6 text-foreground dark:text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{option.title}</h2>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("view")} {option.title}
                  </Button>{" "}
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Finance;
