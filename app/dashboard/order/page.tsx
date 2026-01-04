"use client";

import { CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { OrderSummary } from "@/components/custom/molecules/Order/OrderSummary/OrderSummary";
import { CreateOrder } from "@/components/custom/molecules/Order/CreateOrder/CreateOrder";
import { OrderPage } from "@/components/custom/pages/Order/OrderPage";

export default function Page() {
  return <OrderPage />;
}
