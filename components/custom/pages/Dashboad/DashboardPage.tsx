import { PaymentMethods } from "../../molecules/Dashboard/PaymentMethods";
import { OrdersTracking } from "../../molecules/Dashboard/OrdersTracking";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-5">
        <PaymentMethods />
        <OrdersTracking />
      </div>
    </div>
  );
}
