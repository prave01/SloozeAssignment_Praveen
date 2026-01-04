import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function OrderSummary() {
  const [qty, setQty] = useState(1);
  return (
    <Card
      className="rounded-none border max-w-100 w-full border-myborder
        bg-accent/20 px-3 py-2 gap-2"
    >
      <CardTitle className="font-medium text-lg">Order Summary</CardTitle>
      <CardContent className="p-0 flex flex-col gap-2">
        <div className="w-fit">
          Order Id -{" "}
          <span className="font-semibold text-muted-foreground">#10190</span>
        </div>
        <div
          className="rounded-md border border-myborder px-3 py-2
            transition-colors hover:border-primary/40"
        >
          <div className="flex flex-col gap-1 text-sm">
            <p className="font-medium text-foreground">Pizza</p>

            <div className="flex justify-between text-muted-foreground">
              <span>Cost</span>
              <span className="text-primary">$100 x {qty} = $100</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Location</span>
              <span className="capitalize">America</span>
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
        </div>{" "}
      </CardContent>
    </Card>
  );
}
