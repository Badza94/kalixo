import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CircleCheckBig } from "@workspace/ui/lucide-react";
import { useTranslations } from "next-intl";

function Complete() {
  const t = useTranslations("AuthPages");
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          <div className="rounded-full bg-red p-2 w-12 h-12 mb-4 bg-primary text-primary-foreground mx-auto">
            <CircleCheckBig className="w-8 h-8" />
          </div>
          {t("SuccessPage.title")}
        </CardTitle>
        <CardDescription>
          {t("SuccessPage.description1")}
          <br />
          <br />
          {t("SuccessPage.description2")}{" "}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default Complete;
