import { useItem } from "@/client/store";
import { CustomSelectCard } from "@/components/custom/atoms/CustomSelectCard";
import { CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { GetItems } from "@/server/serverFn";
import { useEffect, useState } from "react";

export function ShowAvailableItems({
  restaurant,
}: {
  restaurant: "america" | "india";
}) {
  const items = useItem((s) => s.itemsState);
  const setItems = useItem((s) => s.setItems);
  const [loading, setLoading] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Record<string, string>>();

  useEffect(() => {
    const Items = async () => {
      setLoading(true);
      const res = await GetItems(restaurant);
      setItems([...res]);
      setLoading(false);
    };
    Items();
  }, [restaurant]);

  useEffect(() => {
    console.log("selectedCards", selectedCards);
  }, [selectedCards]);

  return (
    <div
      className="group overflow-clip h-auto w-1/3 flex flex-col gap-2
        focus:outline-none"
    >
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg transition-all
          duration-200 group-focus-within:border-blue-500/40"
      >
        Available Items
      </CardTitle>

      <div
        className="w-full border p-3 border-myborder transition-all duration-200
          group-focus-within:border-blue-500/40 h-full overflow-x-hidden gap-2
          no-scrollbar relative"
      >
        {loading && (
          <div
            className="absolute flex-col gap-1 w-full h-full flex items-center
              justify-center"
          >
            {" "}
            <Spinner className="size-6" />
            <span className="text-neutral-500 text-md">Fetching Items</span>
          </div>
        )}
        <div className="grid grid-cols-2 flex-wrap gap-2 h-50 pb-2">
          {" "}
          {items.map((item) => (
            <CustomSelectCard
              key={item.id}
              name={item.name}
              cost={item.cost}
              location={item.location}
              id={item.id}
              elapsedTime={item.elapsedTime}
              image={item.image ?? undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
