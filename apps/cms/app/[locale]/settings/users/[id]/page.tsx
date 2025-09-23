import countries from "@/data/countries.json";
import usersData from "@/data/usersData.json";
import channels from "@/data/channels.json";
import { authOptions } from "@/lib/auth-options";
import { getServerSession, User } from "next-auth";
import UserForm from "@/components/settings/users/user-form";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;

  // Find the user by ID
  const user = usersData.find((u) => u.id.toString() === id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserForm
      id={id}
      countries={countries}
      channels={channels}
      user={user}
      currentUser={currentUser as any}
    />
  );
}
