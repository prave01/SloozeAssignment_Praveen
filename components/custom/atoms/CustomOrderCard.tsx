import {
  useAvailableItemsOrder,
  useSelectItemsCardOrder,
} from "@/client/store/Order/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { use, useEffect, useState } from "react";

export function CustomOrderCard({
  id,
  name,
  cost,
  location,
}: {
  id: string;
  name: string;
  cost: number;
  location: "america" | "india";
}) {
  const [qty, setQty] = useState(1);
  const updateQuantity = useSelectItemsCardOrder((s) => s.updateQuantity);
  const selectedItems = useSelectItemsCardOrder((s) => s.selectedItems);
  const removeItem = useSelectItemsCardOrder((s) => s.removeItem);
  const appendItem = useAvailableItemsOrder((s) => s.appendItem);

  useEffect(() => {
    if (selectedItems.size > 0) {
      updateQuantity(id, qty);
    }
  }, [id, qty, updateQuantity]);

  const handleRemove = () => {
    const item = selectedItems.get(id);
    if (item) {
      removeItem([{ itemId: id }]);
      appendItem([item]);
    }
  };

  return (
    <div
      className="rounded-md border border-myborder px-3 py-2 transition-colors
        hover:border-primary/40"
    >
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground capitalize">{name}</p>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Cost</span>
          <span className="text-primary">
            {cost} x {qty} = {location === "america" ? "$" : "₹"}
            {cost * qty}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Location</span>
          <span className="capitalize">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Quantity</span>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-4"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-6 text-center font-medium">{qty}</span>

            <Button
              size="icon"
              variant="ghost"
              className="size-4"
              onClick={() => setQty((q) => q + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
