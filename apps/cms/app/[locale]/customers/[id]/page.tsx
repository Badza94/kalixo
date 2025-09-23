import CustomerForm from "@/components/customers/form";
import countries from "@/data/countries.json";
import channels from "@/data/channels.json";
import customersData from "@/data/customersData.json";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth-options";

async function SingleCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  return (
    <CustomerForm
      id={id}
      countries={countries}
      channels={channels}
      customer={customersData[0]}
      currentUser={currentUser as any}
    />
  );
}

export default SingleCustomerPage;
