"use client";
import React, { useEffect, useState } from "react";
import EmailForm from "./register/email-form";
import { Progress } from "@workspace/ui/components/progress";
import PasswordForm from "./register/password-form";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "@workspace/ui/lucide-react";
import BusinessDetails from "./register/business-details-form";
import PersonalInfoForm from "./register/personal-info-form";
import PhoneVerificationForm from "./register/phone-verification-form";
import RegisterAddressForm from "./register/register-address-form";
import PreferencesForm from "./register/preferences-form";
import Complete from "./register/complete";
import TwoFaForm from "./2fa-form";

function RegisterForm() {
  const t = useTranslations("AuthPages");
  const rt = useTranslations("AuthPages.ResetPasswordPage");
  const totalSteps = 8;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    country: string;
    businessLegalName: string;
    businessTradeName: string;
    registrationNumber: string;
    businessType: string;
    website: string;
    firstName: string;
    lastName: string;
    phone: string;
    otp: string;
    countryOfRegistration: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    preferences: string[];
  }>({
    email: "",
    password: "",
    country: "",
    businessLegalName: "",
    businessTradeName: "",
    registrationNumber: "",
    businessType: "",
    website: "",
    firstName: "",
    lastName: "",
    phone: "",
    otp: "",
    countryOfRegistration: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    preferences: [],
  });
  const [isComplete, setIsComplete] = useState(false);
  const updateFormData = (data: Partial<typeof formData>) => {
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

  const onSubmitEmail = (data: { email: string }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitPassword = (data: {
    password: string;
    confirmPassword: string;
  }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitBusinessDetails = (data: {
    country: string;
    businessLegalName: string;
    businessTradeName?: string;
    registrationNumber: string;
    businessType: string;
    website: string;
  }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitPersonalInfo = (data: {
    firstName: string;
    lastName: string;
  }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitPhoneVerification = (data: { phone: string }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitTwoFa = (data: { otp: string }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitRegisterAddress = (data: {
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
  }) => {
    updateFormData(data);
    nextStep();
  };

  const onSubmitPreferences = (data: { preferences: string[] }) => {
    updateFormData(data);
    nextStep();
  };

  useEffect(() => {
    if (isComplete) {
      // Simulate a server request
      console.log("Form Data: ", formData);
    }
  }, [formData, isComplete]);

  return (
    <div>
      {!isComplete && currentStep > 1 && (
        <Button
          size="icon"
          variant="ghost"
          onClick={prevStep}
          className="absolute top-0 left-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
      {!isComplete && (
        <Progress
          value={(currentStep / totalSteps) * 100}
          className="fixed left-0 top-0 rounded-none"
        />
      )}
      {!isComplete && currentStep === 1 && (
        <EmailForm onSubmit={onSubmitEmail} formData={formData} />
      )}

      {!isComplete && currentStep === 2 && (
        <PasswordForm
          onSubmit={onSubmitPassword}
          btnText={t("continue")}
          title={rt("createPassword")}
          description={rt("createPasswordDescription")}
        />
      )}

      {!isComplete && currentStep === 3 && (
        <PersonalInfoForm onSubmit={onSubmitPersonalInfo} formData={formData} />
      )}

      {!isComplete && currentStep === 4 && (
        <PhoneVerificationForm
          onSubmit={onSubmitPhoneVerification}
          formData={formData}
        />
      )}

      {!isComplete && currentStep === 5 && (
        <TwoFaForm onSubmit={onSubmitTwoFa} />
      )}

      {!isComplete && currentStep === 6 && (
        <BusinessDetails
          onSubmit={onSubmitBusinessDetails}
          formData={formData}
        />
      )}

      {!isComplete && currentStep === 7 && (
        <RegisterAddressForm
          onSubmit={onSubmitRegisterAddress}
          formData={formData}
        />
      )}
      {!isComplete && currentStep === 8 && (
        <PreferencesForm onSubmit={onSubmitPreferences} formData={formData} />
      )}

      {isComplete && <Complete />}
    </div>
  );
}

export default RegisterForm;
