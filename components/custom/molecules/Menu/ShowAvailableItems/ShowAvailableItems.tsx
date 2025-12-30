import { useItem } from "@/client/store";
import { CustomSelectCard } from "@/components/custom/atoms/CustomSelectCard";
import { CardTitle, CardContent } from "@/components/ui/card";
import { GetItems } from "@/server/serverFn";
import { useEffect } from "react";

export function ShowAvailableItems() {
  const items = useItem((s) => s.itemsState);
  const setItems = useItem((s) => s.setItems);

  useEffect(() => {
    const Items = async () => {
      const res = await GetItems();
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
        className="flex-1 w-full border p-3 border-myborder transition-all
          duration-200 group-focus-within:border-blue-500/40 overflow-y-auto
          overflow-x-hidden relative overscroll-none"
      >
        <div className="grid absolute z-30 grid-cols-2 w-full gap-2">
          {items.map((item, idx) => (
            <CustomSelectCard
              key={idx}
              selectedCards={[]}
              itemName={item.name}
              cost={item.cost}
              elapsedTime={item.elapsedTime}
              image={item.image ?? ""}
            />
          ))}
        </div>
      </CardContent>
    </div>
  );
}
