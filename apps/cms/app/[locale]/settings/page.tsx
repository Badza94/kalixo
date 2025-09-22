import { getTranslations } from "next-intl/server";
import {
  Settings,
  Users,
  Shield,
  Lock,
  Globe,
  Languages,
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
import PageTitle from "@/components/page-title";

async function SettingsPage() {
  const t = await getTranslations("Settings");

  const settingsOptions = [
    {
      title: t("navigation.apiSettings"),
      description: t("navigation.apiSettingsDescription"),
      icon: Settings,
      path: "/settings/api",
    },
    {
      title: t("navigation.userManagement"),
      description: t("navigation.userManagementDescription"),
      icon: Users,
      path: "/settings/users",
    },
    {
      title: t("navigation.roleManagement"),
      description: t("navigation.roleManagementDescription"),
      icon: Shield,
      path: "/settings/roles",
    },
    {
      title: t("navigation.securitySettings"),
      description: t("navigation.securitySettingsDescription"),
      icon: Lock,
      path: "/settings/security",
    },
    {
      title: t("navigation.marketsManagement"),
      description: t("navigation.marketsManagementDescription"),
      icon: Globe,
      path: "/settings/markets",
    },
    {
      title: t("navigation.translationManagement"),
      description: t("navigation.translationManagementDescription"),
      icon: Languages,
      path: "/settings/translations",
    },
  ];

  return (
    <div className="space-y-4">
      <PageTitle title={t("title")} description={t("description")} />

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {settingsOptions.map((option) => {
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
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsPage;
