import { CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { getMenuId } from "@/server/serverFn";
import { useEffect, useState } from "react";
import { CreateOrder } from "../../molecules/Order/CreateOrder/CreateOrder";
import { OrderSummary } from "../../molecules/Order/OrderSummary/OrderSummary";
import { CheckOut } from "../../molecules/Order/CheckOut/CheckOut";

export function OrderPage() {
  const [location, setLocation] = useState<"america" | "india">("america");
  const [menuId, setMenuId] = useState("");

  useEffect(() => {
    (async () => {
      const id = await getMenuId(location);
      setMenuId(id as string);
    })();
  }, [location]);

  const handleValueChange = async (value: any) => {
    setLocation(value as "india" | "america");
  };

  return (
    <>
      {" "}
      <div className="relative z-10 p-30">
        <div className="border border-myborder min-h-100 h-full backdrop-blur-sm">
          <CardTitle
            className="flex flex-col gap-2 items-start text-xl font-semibold
              w-full"
          >
            <p className="px-2 py-1 w-full border-b border-myborder">
              Create Order{" "}
            </p>
            <div className="flex px-2">
              {" "}
              <Select
                required
                value={location}
                onValueChange={handleValueChange}
              >
                <SelectTrigger
                  className="w-45 p-2 border border-myborder rounded-none
                    justify-start"
                >
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Restaurant</SelectLabel>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="america">America</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
          <CardContent className="p-2 flex flex-row h-full gap-2">
            <CreateOrder menuId={menuId} restaurant={location} />
            <OrderSummary location={location} />
            <CheckOut location={location} />
          </CardContent>
        </div>
      </div>
    </>
  );
}
