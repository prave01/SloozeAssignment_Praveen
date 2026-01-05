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
import Image from "next/image";

export function PaymentDrawer({ total = 0 }: { total: number }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="p-5 mt-auto">
          Pay Now
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div
          className="mx-auto w-full max-w-sm flex items-center justify-center
            flex-col"
        >
          <DrawerHeader>
            <DrawerTitle>Payment Methods</DrawerTitle>
            <DrawerDescription>
              Only admin can change the payment method
            </DrawerDescription>
          </DrawerHeader>
          <p className="text-4xl font-semibold mb-4">
            Total - <span className="text-muted-foreground">{total}</span>
          </p>
          <div className="flex w-125 gap-3 items-center justify-center">
            <Card
              className="p-5 border border-myborder gap-3 w-55 flex items-center
                justify-center flex-col"
            >
              <Image
                src={"/payment-icons/google-pay.png"}
                width={500}
                height={500}
                className="size-20"
                alt={""}
              />
              <p className="text-muted-foreground">Google Pay</p>
            </Card>
            <Card
              className="p-5 border border-myborder gap-3 w-55 flex items-center
                justify-center flex-col"
            >
              <Image
                src={"/payment-icons/google-pay.png"}
                width={500}
                height={500}
                className="size-20"
                alt={""}
              />
              <p className="text-muted-foreground">Google Pay</p>
            </Card>
            <Card
              className="p-5 border border-myborder gap-3 w-55 flex items-center
                justify-center flex-col"
            >
              <Image
                src={"/payment-icons/google-pay.png"}
                width={500}
                height={500}
                className="size-20"
                alt={""}
              />
              <p className="text-muted-foreground">Google Pay</p>
            </Card>
          </div>
          <DrawerFooter className="w-full flex items-center justify-center">
            <Button className="w-[70%]">Submit</Button>
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
