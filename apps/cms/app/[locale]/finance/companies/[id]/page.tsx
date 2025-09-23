import ChannelsTable from "@/components/finance/companies/channels-table";
import CompanyForm from "@/components/finance/companies/company-form";
import TeamMembersTable from "@/components/finance/companies/team-members-table";
import Notes from "@/components/notes";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@workspace/ui/components/card";
import { Timeline, TimelineEntry } from "@workspace/ui/components/timeline";
import companies from "@/data/companies.json";
import countries from "@/data/countries.json";
import currencies from "@/data/currencies.json";
import notes from "@/data/notes.json";
import timelineData from "@/data/timeline-fake.json";
import { authOptions } from "@/lib/auth-options";
import { getServerSession, User } from "next-auth";
import { getTranslations } from "next-intl/server";

async function CompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const t = await getTranslations("Finance.Companies");
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="space-y-4 mb-4">
      <CompanyForm
        id={id}
        company={companies[0]}
        isEdit={edit === "true" ? true : false}
        countries={countries}
        currencies={currencies}
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ChannelsTable channels={companies?.[0]?.channels || []} />
        </div>
        <div className="col-span-12">
          <TeamMembersTable teamMembers={companies?.[0]?.teamMembers || []} />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("timeline")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Timeline entries={timelineData as TimelineEntry[]} />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <Notes notes={notes} currentUser={user as any} companyId={id} />
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;
