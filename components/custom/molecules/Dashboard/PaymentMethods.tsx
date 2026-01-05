"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GetPaymentMethods, TogglePaymentMethod } from "@/server/serverFn";
import { useEffect, useState } from "react";
import { CreatePaymentDialog } from "./CreatePaymentMethod";
import { toast } from "sonner";

type PaymentMethod = {
  id: string;
  name: string;
  isEnabled: boolean;
  image?: string;
};

export function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await GetPaymentMethods();
      setMethods(data);
    })();
  }, []);

  const handleToggle = async (id: string, next: boolean) => {
    // optimistic update
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isEnabled: next } : m)),
    );

    setLoadingId(id);

    try {
      await TogglePaymentMethod(id, next);
      toast.success("Updated");
    } catch {
      // rollback
      setMethods((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isEnabled: !next } : m)),
      );
      toast.error("Failed to update");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-5">
      <Card
        className="rounded-none border border-myborder bg-transparent
          backdrop-blur-md max-w-62.5 w-full p-0 gap-0"
      >
        <CardTitle
          className="w-full flex items-center justify-between py-2 px-3 border-b
            border-myborder text-md"
        >
          Payment Methods
          <CreatePaymentDialog />
        </CardTitle>

        <CardContent className="flex flex-col gap-3 py-3 px-4 bg-accent/80 h-48">
          {methods.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2
                text-center"
            >
              <div
                className="h-10 w-10 rounded-full bg-muted flex items-center
                  justify-center text-muted-foreground text-sm font-semibold"
              >
                $
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                No payment methods found
              </p>

              <p className="text-xs text-muted-foreground">
                Add a payment method to get started
              </p>
            </div>
          ) : (
            methods.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md px-3
                  py-2 transition hover:bg-accent/40"
              >
                {/* Left side */}
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  ) : (
                    <div
                      className="h-8 w-8 rounded-md bg-muted flex items-center
                        justify-center text-xs font-semibold
                        text-muted-foreground"
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <Label className="text-sm font-medium">{item.name}</Label>
                </div>

                {/* Toggle */}
                <Switch
                  checked={item.isEnabled}
                  disabled={loadingId === item.id}
                  onCheckedChange={(val) => handleToggle(item.id, val)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
