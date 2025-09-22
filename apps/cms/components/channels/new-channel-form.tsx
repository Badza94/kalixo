"use client";
import React, { useEffect, useState } from "react";

import ChannelTypeSelection from "./channel-type-selection";
import ChannelInformationForm from "./channel-information-form";
import { useRouter } from "@/i18n/navigation";

export type ChannelType =
  | "bulkOrdering"
  | "firstParty"
  | "whiteLabel"
  | "marketplace"
  | "marketing"
  | "claim"
  | "api"
  | "custom";

export interface NewChannelFormData {
  channelType: ChannelType | null;
  channelName: string;
  channelId: number;
  description: string;
  companyId: string;
  domainType: "default" | "custom";
  customDomain: string;
  logo: File | null;
  icon: File | null;
  favicon: File | null;
  defaultLocation: string;
  defaultCurrency: string;
  defaultLanguage: string;
}

function NewChannelForm() {
  const router = useRouter();
  const totalSteps = 2;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NewChannelFormData>({
    channelType: null,
    channelName: "",
    channelId: 1, // Auto-generated
    description: "",
    companyId: "",
    domainType: "default",
    customDomain: "",
    logo: null,
    icon: null,
    favicon: null,
    defaultLocation: "",
    defaultCurrency: "",
    defaultLanguage: "",
  });
  const [isComplete, setIsComplete] = useState(false);

  const updateFormData = (data: Partial<NewChannelFormData>) => {
    setFormData({ ...formData, ...data });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmitChannelType = (data: { channelType: ChannelType }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitChannelInformation = (data: Partial<NewChannelFormData>) => {
    updateFormData(data);
    setIsComplete(true);
    console.log("Channel creation data:", { ...formData, ...data });
  };

  const handleCancel = () => {
    // Navigate back or reset form
    router.back();
  };

  useEffect(() => {
    if (isComplete) {
      router.push("/channels");
    }
  }, [isComplete, router]);

  return (
    <div>
      {!isComplete && currentStep === 1 && (
        <ChannelTypeSelection
          onSubmit={onSubmitChannelType}
          onCancel={handleCancel}
          formData={formData}
        />
      )}

      {!isComplete && currentStep === 2 && (
        <ChannelInformationForm
          onSubmit={onSubmitChannelInformation}
          onBack={prevStep}
          formData={formData}
        />
      )}
    </div>
  );
}

export default NewChannelForm;
