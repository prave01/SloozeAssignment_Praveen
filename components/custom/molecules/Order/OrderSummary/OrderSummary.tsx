import { useSelectItemsCardOrder } from "@/client/store/Order/store";
import { CustomOrderCard } from "@/components/custom/atoms/CustomOrderCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateItemType } from "@/server/zod-schema";
import { useState } from "react";

export function OrderSummary() {
  const [qty, setQty] = useState(1);
  const selectedItems = useSelectItemsCardOrder((s) => s.selectedItems);

  const itemsArray: CreateItemType[] = Array.from(selectedItems.values());

  return (
    <Card
      className="rounded-none border max-w-100 w-full border-myborder
        bg-accent/20 px-3 py-2 gap-2"
    >
      <CardTitle className="font-medium text-lg">Order Summary</CardTitle>
      <CardContent
        className="p-0 overflow-y-scroll no-scrollbar h-[475px] flex flex-col
          gap-2"
      >
        {itemsArray.map((item) => (
          <CustomOrderCard
            key={item?.id}
            id={item.id as string}
            location={item.location}
            name={item.name}
          />
        ))}
      </CardContent>
    </Card>
  );
}
