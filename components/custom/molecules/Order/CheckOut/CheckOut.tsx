import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSelectItemsCardOrder } from "@/client/store/Order/store";
import { Separator } from "@/components/ui/separator";
import { PaymentDrawer } from "../Payment/PaymentDrawer";

export function CheckOut({ location }: { location: "america" | "india" }) {
  const selectedItems = useSelectItemsCardOrder((s) => s.selectedItems);
  const items = [...selectedItems.values()];

  const currencySymbol = location === "america" ? "$" : "₹";

  const subtotal = items.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0,
  );

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <Card
      className="flex-1 rounded-none border border-myborder bg-transparent px-3
        py-2 gap-2"
    >
      <CardTitle className="text-lg">Checkout</CardTitle>

      <CardContent className="p-2 h-full flex flex-col gap-3">
        {/* Merchant */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Merchant</span>
          <span className="font-medium capitalize">{location}</span>
        </div>

        <Separator />

        {/* Items */}
        <div
          className="flex flex-col h-65 no-scrollbar overflow-y-scroll gap-2
            text-sm"
        >
          {items.length === 0 && (
            <p className="text-muted-foreground text-center">
              No items selected
            </p>
          )}

          {items.map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <span className="capitalize">
                {item.name} × {item.quantity}
              </span>
              <span>
                {currencySymbol}
                {item.cost * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {currencySymbol}
              {subtotal}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span>
              {currencySymbol}
              {tax}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span className="text-primary">
              {currencySymbol}
              {total}
            </span>
          </div>
        </div>
        <PaymentDrawer total={total} location={location} />
      </CardContent>
    </Card>
  );
}
