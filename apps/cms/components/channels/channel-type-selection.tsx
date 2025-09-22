"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Package,
  Store,
  Globe,
  ShoppingCart,
  TrendingUp,
  Gift,
  Code,
  Settings,
} from "@workspace/ui/lucide-react";
import { ChannelType } from "./new-channel-form";

interface ChannelTypeSelectionProps {
  onSubmit: (data: { channelType: ChannelType }) => void;
  onCancel: () => void;
  formData: { channelType: ChannelType | null };
}

const channelTypeIcons: Record<ChannelType, React.ReactNode> = {
  bulkOrdering: <Package className="w-8 h-8" />,
  firstParty: <Store className="w-8 h-8" />,
  whiteLabel: <Globe className="w-8 h-8" />,
  marketplace: <ShoppingCart className="w-8 h-8" />,
  marketing: <TrendingUp className="w-8 h-8" />,
  claim: <Gift className="w-8 h-8" />,
  api: <Code className="w-8 h-8" />,
  custom: <Settings className="w-8 h-8" />,
};

const channelTypes: ChannelType[] = [
  "bulkOrdering",
  "firstParty",
  "whiteLabel",
  "marketplace",
  "marketing",
  "claim",
  "api",
  "custom",
];

function ChannelTypeSelection({
  onSubmit,
  onCancel,
  formData,
}: ChannelTypeSelectionProps) {
  const t = useTranslations("Channels.NewChannel.stepOne");
  const [selectedType, setSelectedType] = useState<ChannelType | null>(
    formData.channelType
  );

  const handleSubmit = () => {
    if (selectedType) {
      onSubmit({ channelType: selectedType });
    }
  };

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {channelTypes.map((type) => (
          <Card
            key={type}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === type
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => setSelectedType(type)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4 text-muted-foreground">
                {channelTypeIcons[type]}
              </div>
              <h3 className="font-semibold mb-2">
                {t(`channelTypes.${type}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`channelTypes.${type}.description`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedType}>
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}

export default ChannelTypeSelection;
