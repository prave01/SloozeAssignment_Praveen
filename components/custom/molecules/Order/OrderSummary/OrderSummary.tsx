import { useSelectItemsCardOrder } from "@/client/store/Order/store";
import { CustomOrderCard } from "@/components/custom/atoms/CustomOrderCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export function OrderSummary({ location }: { location: "america" | "india" }) {
  const selectedItems = useSelectItemsCardOrder((s) => s.selectedItems);
  const clear = useSelectItemsCardOrder((s) => s.clear);

  useEffect(() => {
    clear();
  }, [location, clear]);

  const items = Array.from(selectedItems.values());

  return (
    <Card
      className="rounded-none border max-w-100 w-full border-myborder
        bg-accent/20 px-3 py-2 gap-2"
    >
      <CardTitle className="font-medium text-lg">Order Summary</CardTitle>

      <CardContent
        className="p-0 overflow-y-scroll no-scrollbar h-118.75 flex flex-col
          gap-2"
      >
        {items.length === 0 && (
          <p className="text-muted-foreground text-center">No items selected</p>
        )}

        {items.map((item) => (
          <CustomOrderCard
            key={item.id}
            id={item.id as string}
            cost={item.cost}
            location={item.location}
            name={item.name}
          />
        ))}
      </CardContent>
    </Card>
  );
}
