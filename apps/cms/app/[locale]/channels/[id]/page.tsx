import ChannelForm from "@/components/channels/form";
import { notFound } from "next/navigation";
import channelsData from "@/data/channelsData.json";
import timelineData from "@/data/timeline-fake.json";
import { TimelineEntry } from "@workspace/ui/components/timeline";
import notes from "@/data/notes.json";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth-options";

async function SingleChannelPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const user = session?.user;

  const channel = channelsData.find((channel) => channel.id === parseInt(id));

  return (
    <div className="flex flex-col gap-4">
      <ChannelForm
        id={id}
        edit={edit === "true"}
        channel={channel}
        timelineData={timelineData as TimelineEntry[]}
        notes={notes}
        currentUser={user as User}
      />
    </div>
  );
}

export default SingleChannelPage;
