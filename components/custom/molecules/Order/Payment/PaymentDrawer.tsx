"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { GetPaymentMethods } from "@/server/serverFn";
import Image from "next/image";
import { useEffect, useState } from "react";

type PaymentMethod = {
  id: string;
  name: string;
  image?: string;
  isEnabled: boolean;
};

export function PaymentDrawer({
  total = 0,
  location,
}: {
  total: number;
  location: "america" | "india";
}) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const currencySymbol = location === "america" ? "$" : "₹";

  useEffect(() => {
    (async () => {
      const data = await GetPaymentMethods();
      setMethods(data);
    })();
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          disabled={total === 0}
          variant="outline"
          className="p-5 mt-auto"
        >
          Pay Now
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-md flex flex-col items-center">
          <DrawerHeader className="text-center">
            <DrawerTitle>Payment Methods</DrawerTitle>
            <DrawerDescription>
              Select a payment method to continue
            </DrawerDescription>
          </DrawerHeader>

          {/* Total */}
          <p className="text-4xl font-semibold mb-6">
            Total{" "}
            <span className="text-primary">
              {currencySymbol}
              {total}
            </span>
          </p>

          {/* Payment methods - single row */}
          <div
            className="flex gap-4 overflow-x-auto pb-2 mb-6 w-full
              justify-center"
          >
            {methods.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No payment methods available
              </p>
            )}

            {methods.map((method) => {
              const disabled = !method.isEnabled;
              const isSelected = selected === method.id;

              return (
                <Card
                  key={method.id}
                  onClick={() => {
                    if (!disabled) setSelected(method.id);
                  }}
                  className={` relative min-w-[120px] h-[120px] flex flex-col
                  items-center justify-center gap-2 transition-all ${disabled
                      ? "cursor-not-allowed bg-muted/40 opacity-60"
                      : isSelected
                        ? "border-primary ring-2 ring-primary"
                        : "hover:bg-accent/40 cursor-pointer"
                    } `}
                >
                  {/* Image */}
                  {method.image ? (
                    <Image
                      src={method.image}
                      width={64}
                      height={64}
                      className={`h-14 w-14 object-contain ${disabled ? "grayscale blur-[0.3px]" : ""
                        }`}
                      alt={method.name}
                    />
                  ) : (
                    <div
                      className="h-14 w-14 rounded-md bg-muted flex items-center
                        justify-center text-lg font-semibold
                        text-muted-foreground"
                    >
                      {method.name.charAt(0)}
                    </div>
                  )}

                  <p className="text-xs font-medium text-muted-foreground">
                    {method.name}
                  </p>

                  {/* Muted unavailable pill */}
                  {disabled && (
                    <span
                      className="absolute bottom-2 rounded-full bg-muted px-2
                        py-[2px] text-[10px] text-muted-foreground"
                    >
                      Unavailable
                    </span>
                  )}
                </Card>
              );
            })}
          </div>

          <DrawerFooter className="w-full flex flex-col items-center gap-2">
            <Button
              className="w-[70%]"
              disabled={
                !selected || !methods.find((m) => m.id === selected)?.isEnabled
              }
            >
              Pay {currencySymbol}
              {total}
            </Button>

            <DrawerClose asChild>
              <Button variant="outline" className="w-[70%]">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
