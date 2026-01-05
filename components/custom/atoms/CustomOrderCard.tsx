import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function CustomOrderCard({
  name,
  location,
}: {
  name: string;
  location: "america" | "india";
}) {
  const [qty, setQty] = useState(0);

  return (
    <div
      className="rounded-md border border-myborder px-3 py-2 transition-colors
        hover:border-primary/40"
    >
      <div className="flex flex-col gap-1 text-sm">
        <p className="font-medium text-foreground capitalize">{name}</p>

        <div className="flex justify-between text-muted-foreground">
          <span>Cost</span>
          <span className="text-primary">$100 x {qty} = $100</span>
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
