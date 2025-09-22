import TwoFaForm from "@/components/auth/2fa-form";

export default function TwoFactorAuthPage() {
  const onSubmitTwoFa = async (data: unknown) => {
    // Handle the form submission here
    console.log("Two-Factor Authentication Data:", data);
    // You can add your API call or any other logic here
  };
  return <TwoFaForm onSubmit={onSubmitTwoFa} />;
}
