import { CustomSelectCard } from "@/components/custom/atoms/CustomSelectCard";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { GetItems } from "@/server/serverFn";
import { useEffect, useState } from "react";

export function ShowAvailableItems() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const Items = async () => {
      const res = await GetItems();
      console.log(res);
      setItems([...res]);
    };
    Items();
  }, []);
  return (
    <div className="group w-1/3 h-full flex flex-col gap-2 focus:outline-none">
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg transition-all
          duration-200 group-focus-within:border-blue-500/40"
      >
        Available Items
      </CardTitle>

      <CardContent
        className="w-full h-full border flex items-start justify-center
          border-myborder transition-all p-3 duration-200
          group-focus-within:border-blue-500/40"
      >
        <div className="grid grid-cols-2 w-full gap-2">
          {items.map((item, idx) => (
            <CustomSelectCard
              key={idx}
              selectedCards={[]}
              itemName={item?.name}
              cost={item?.cost}
              elapsedTime={item.elapsedTime}
              image={item.image}
            />
          ))}
        </div>
      </CardContent>
    </div>
  );
}
