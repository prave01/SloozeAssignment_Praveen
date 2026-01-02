import { useItem, useSelectItems } from "@/client/store";
import { CustomInput } from "@/components/custom/atoms/CustomInput";
import { CustomSelectCard } from "@/components/custom/atoms/CustomSelectCard";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AddItemsByMenu, GetItems, GetMenuItems } from "@/server/serverFn";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ShowAvailableItems({
  restaurant,
  menuId,
}: {
  restaurant: "america" | "india";
  menuId?: string;
}) {
  const items = useItem((s) => s.itemsState);
  const setItems = useItem((s) => s.setItems);
  const removeItem = useItem((s) => s.removeItems);

  const selectedCards = useSelectItems((s) => s.selectedItemIds);
  const removeCard = useSelectItems((s) => s.removeItem);

  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  const handleAddItems = async () => {
    try {
      if (selectedCards.size < 1) {
        toast.error("Please selelct atleast one to proceed");
        return;
      }
      setAddLoading(true);
      const addedItem = await AddItemsByMenu(selectedCards);

      removeItem(addedItem);
      removeCard(addedItem);

      toast.success("Items inserted successfully");
    } catch (err: any) {
      toast.error("Somthing went wrong", { description: `${err}` });
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    if (!menuId) return;
    (async () => {
      setLoading(true);
      try {
        const [allItems, menuItems] = await Promise.all([
          GetItems(restaurant),
          GetMenuItems(menuId),
        ]);

        const menuItemIds = new Set(menuItems.map((item) => item.itemId));

        const availableItems = allItems.filter(
          (item) => !menuItemIds.has(item.id),
        );

        setItems(availableItems);
      } finally {
        setLoading(false);
      }
    })();
  }, [menuId]);

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
        className="w-full bg-transparent border p-3 border-myborder
          transition-all duration-200 group-focus-within:border-blue-500/40
          h-full overflow-x-hidden gap-3 no-scrollbar relative flex flex-col"
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
        <div className="w-full flex h-auto items-center justify-between">
          {" "}
          <div className="text-neutral-500 text-sm">
            Selected Items -
            <span className="text-primary"> {selectedCards.size}</span>
          </div>
          <Button onClick={handleAddItems}>
            {addLoading ? <Spinner className="size-5" /> : "Add Items"}
          </Button>
        </div>

        <div className="w-full">
          <input
            value={searchInput}
            placeholder="Find Items by Name"
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value);
            }}
            className={`rounded-none placeholder:text-xs text-sm w-full
              placeholder:pl-1 placeholder:italic focus:outline-none
              focus:bg-zinc-500/20 border border-myborder px-2 py-2`}
          />
        </div>

        <div className="grid grid-cols-2 flex-wrap gap-2 h-50 pb-2">
          {" "}
          {items.map((item) => (
            <CustomSelectCard
              key={item.id as string}
              name={item.name}
              cost={item.cost}
              menuId={menuId as string}
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
