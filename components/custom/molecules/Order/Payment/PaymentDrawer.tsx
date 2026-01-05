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
import { AddOrderItems, GetPaymentMethods } from "@/server/serverFn";
import { useSelectItemsCardOrder } from "@/client/store/Order/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserProfile } from "@/server/serverFn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PaymentMethod = {
  id: string;
  name: string;
  image?: string | null;
  isEnabled: boolean;
  location: "america" | "india";
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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [canPlaceOrder, setCanPlaceOrder] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  const selectedItems = useSelectItemsCardOrder((s) => s.selectedItems);
  const clearCart = useSelectItemsCardOrder((s) => s.clear);

  const currencySymbol = location === "america" ? "$" : "₹";

  useEffect(() => {
    (async () => {
      try {
        const user = await getUserProfile();
        setCanPlaceOrder(user.role === "admin" || user.role === "manager");
      } catch (e) {
        console.error(e);
      } finally {
        setIsCheckingRole(false);
      }
      const data = await GetPaymentMethods(location);
      setMethods(data);
    })();
  }, [location]);

  const handlePayment = async () => {
    if (!selected) {
      toast.error("Please select a payment method");
      return;
    }

    const items = Array.from(selectedItems.values());
    if (items.length === 0) {
      toast.error("No items in cart");
      return;
    }

    setLoading(true);
    try {
      // For now, using a default customer name. You can get it from auth later
      const customerName = "Guest Customer";

      const result = await AddOrderItems(
        items,
        customerName,
        location,
        total,
        selected,
      );

      if (result?.orderId) {
        toast.success(`Order #${result.orderId} created successfully!`);
        clearCart();
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                disabled={total === 0 || !canPlaceOrder || isCheckingRole}
                variant="outline"
                className="p-5 mt-auto w-full"
                onClick={() => setOpen(true)}
              >
                {isCheckingRole ? "Checking Permissions..." : "Pay Now"}
              </Button>
            </div>
          </TooltipTrigger>
          {!canPlaceOrder && !isCheckingRole && (
            <TooltipContent>
              <p>Only Admins and Managers can place orders.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

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

            {methods.map((method: PaymentMethod) => {
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
                loading ||
                !selected ||
                !methods.find((m: PaymentMethod) => m.id === selected)?.isEnabled
              }
              onClick={handlePayment}
            >
              {loading ? "Processing..." : `Pay ${currencySymbol}${total}`}
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
