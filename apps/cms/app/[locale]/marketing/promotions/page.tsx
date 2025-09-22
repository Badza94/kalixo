import PageTitle from "@/components/page-title";
import { getTranslations } from "next-intl/server";
import AddPromotionDialog from "@/components/marketing/promotions/add-promotion-dialog";
import Filters from "@/components/marketing/promotions/filters";
import { startOfDay, endOfDay } from "@workspace/ui/lib/date-fns";
import promotions from "@/data/promotions.json";
import PromotionsTable, {
  Promotion,
} from "@/components/marketing/promotions/promotions-table";

interface PromotionsPageProps {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  channels?: string | string[];
  types?: string | string[];
  statuses?: string | string[];
  sort?: string;
  limit?: string;
  page?: string;
  edit?: string;
}

async function Promotions(props: {
  searchParams: Promise<PromotionsPageProps>;
}) {
  const searchParams = await props.searchParams;

  const t = await getTranslations("Marketing.Promotions");

  // Parse search params
  const search = searchParams.search || "";

  // Date range - default to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const dateFrom = searchParams.dateFrom
    ? startOfDay(new Date(searchParams.dateFrom))
    : startOfDay(thirtyDaysAgo);
  const dateTo = searchParams.dateTo
    ? endOfDay(new Date(searchParams.dateTo))
    : endOfDay(today);

  // Parse array parameters
  const channels = Array.isArray(searchParams.channels)
    ? searchParams.channels
    : searchParams.channels
      ? [searchParams.channels]
      : [];

  const types = Array.isArray(searchParams.types)
    ? searchParams.types
    : searchParams.types
      ? [searchParams.types]
      : [];

  const statuses = Array.isArray(searchParams.statuses)
    ? searchParams.statuses
    : searchParams.statuses
      ? [searchParams.statuses]
      : [];
  const initialSort = searchParams.sort ?? "newest";
  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;

  // Find promotion for editing if edit parameter is present
  const editPromotionId = searchParams.edit;
  const editPromotion = editPromotionId
    ? (promotions as Promotion[]).find(
        (p) => p.id.toString() === editPromotionId
      )
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PageTitle title={t("title")} description={t("description")} />
        <AddPromotionDialog promotion={editPromotion} />
      </div>

      <Filters
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
        initialChannels={channels}
        initialTypes={types}
        initialStatuses={statuses}
        initialSearchQuery={search}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <PromotionsTable
            promotions={promotions as Promotion[]}
            initialSort={initialSort}
            initialLimit={initialLimit}
            initialPage={initialPage}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
}

export default Promotions;
