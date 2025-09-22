import Filters from "@/components/orders/filters";
import OrderHeader from "@/components/orders/header";
import OrdersTable from "@/components/orders/table";
import channels from "@/data/channels.json";
import countries from "@/data/countries.json";
import paymentStatus from "@/data/paymentStatus.json";
import orderStatus from "@/data/orderStatus.json";
import ordersData from "@/data/ordersData.json";

interface SearchParams {
  sort?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
  countries?: string;
  channels?: string;
  paymentStatus?: string;
  orderStatus?: string;
  page?: string;
}

async function OrdersPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;

  const initialDateFrom = searchParams.startDate
    ? new Date(searchParams.startDate as string)
    : new Date(new Date().getFullYear(), 0, 1);
  const initialDateTo = searchParams.endDate
    ? new Date(searchParams.endDate as string)
    : new Date();

  const initialCountries = searchParams.countries
    ? Array.isArray(searchParams.countries)
      ? searchParams.countries
      : [searchParams.countries]
    : [];

  const initialChannels = searchParams.channels
    ? Array.isArray(searchParams.channels)
      ? searchParams.channels
      : [searchParams.channels]
    : [];

  const initialPaymentStatus = searchParams.paymentStatus
    ? Array.isArray(searchParams.paymentStatus)
      ? searchParams.paymentStatus
      : [searchParams.paymentStatus]
    : [];

  const initialOrderStatus = searchParams.orderStatus
    ? Array.isArray(searchParams.orderStatus)
      ? searchParams.orderStatus
      : [searchParams.orderStatus]
    : [];

  const initialSort = searchParams.sort ?? "newest";
  const initialLimit = searchParams.limit ?? "10";
  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  return (
    <div className="space-y-4">
      <OrderHeader />
      <Filters
        initialDateFrom={initialDateFrom}
        initialDateTo={initialDateTo}
        countries={countries}
        initialCountries={initialCountries}
        channels={channels}
        initialChannels={initialChannels}
        paymentStatus={paymentStatus}
        initialPaymentStatus={initialPaymentStatus}
        orderStatus={orderStatus}
        initialOrderStatus={initialOrderStatus}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <OrdersTable
            orders={ordersData}
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

export default OrdersPage;
