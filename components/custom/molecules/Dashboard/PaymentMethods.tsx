"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GetPaymentMethods } from "@/server/serverFn";
import { useEffect, useState } from "react";
import { CreatePaymentDialog } from "./CreatePaymentMethod";

export function PaymentMethods() {
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const methods = await GetPaymentMethods();
      setMethods(methods);
    })();
  }, []);

  return (
    <div className="p-5">
      <Card
        className="gap-2 rounded-none border border-myborder bg-transparent
          backdrop-blur-md max-w-62.5 w-full p-0"
      >
        <CardTitle
          className="w-full flex items-center justify-between py-2 px-3 border-b
            border-myborder text-md"
        >
          Payment Methods
          <CreatePaymentDialog />
        </CardTitle>
        <CardContent
          className="text-md font-medium flex flex-col gap-4 py-5 items-center
            justify-center"
        >
          {methods.map((item) => (
            <div className="flex gap-5 items-center justify-center">
              {" "}
              <Switch id={item.name} />
              <Label className="text-md" htmlFor={item.name}>
                Google Pay
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
