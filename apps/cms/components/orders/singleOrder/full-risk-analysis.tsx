import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { format } from "@workspace/ui/lib/date-fns";
import { getTranslations } from "next-intl/server";

async function FullRiskAnalysis({
  riskAnalysis,
}: {
  riskAnalysis: {
    ipAddress: string;
    deviceId: string;
    location: {
      city: string;
      country: string;
    };
    emailDomain: string;
    paymentMethod: string;
    paymentType: string;
    cardBIN?: number;
    threeDSStatus: boolean;
    riskScore: number;
    riskLevel: string;
    numberOfOrders?: number;
    lastPurchaseDate?: string;
  };
}) {
  const t = await getTranslations("Orders.SingleOrder");

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return <Badge variant="success">{t("lowRisk")}</Badge>;
      case "medium":
        return <Badge variant="warning">{t("mediumRisk")}</Badge>;
      case "high":
        return <Badge variant="destructive">{t("highRisk")}</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("fullAnalysis")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("fullRiskAnalysis")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4">{t("customerInformation")}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("ipAddress")}
                </p>
                <p className="font-medium">{riskAnalysis.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("deviceId")}</p>
                <p className="font-medium">{riskAnalysis.deviceId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("location")}</p>
                <p className="font-medium">
                  {riskAnalysis.location.city}, {riskAnalysis.location.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("emailDomain")}
                </p>
                <p className="font-medium">{riskAnalysis.emailDomain}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">{t("paymentInformation")}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("paymentMethod")}
                </p>
                <p className="font-medium">{riskAnalysis.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("paymentType")}
                </p>
                <p className="font-medium">{riskAnalysis.paymentType}</p>
              </div>
              {riskAnalysis.cardBIN && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("cardBIN")}
                  </p>
                  <p className="font-medium">{riskAnalysis.cardBIN}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("3dsStatus")}
                </p>
                <Badge
                  variant={
                    riskAnalysis.threeDSStatus ? "success" : "destructive"
                  }
                  className="mt-1"
                >
                  {riskAnalysis.threeDSStatus ? "Success" : "Failed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-4">{t("riskAssessment")}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("riskScore")}
                </p>
                <p className="font-medium">{riskAnalysis.riskScore}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("riskLevel")}
                </p>
                {getRiskLevelBadge(riskAnalysis.riskLevel)}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("prevOrders")}
                </p>
                <p className="font-medium">
                  {riskAnalysis.numberOfOrders || 0}
                </p>
              </div>
              {riskAnalysis.lastPurchaseDate && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("lastPurchase")}
                  </p>
                  <p className="font-medium">
                    {format(
                      new Date(riskAnalysis.lastPurchaseDate),
                      "yyyy-MM-dd"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FullRiskAnalysis;
