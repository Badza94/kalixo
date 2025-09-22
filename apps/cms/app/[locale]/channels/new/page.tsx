import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import NewChannelForm from "@/components/channels/new-channel-form";

async function NewChannelPage() {
  const t = await getTranslations("Channels.NewChannel");

  return (
    <div className="space-y-4 mb-4">
      <PageTitle title={t("title")} description={t("description")} />

      <NewChannelForm />
    </div>
  );
}

export default NewChannelPage;
