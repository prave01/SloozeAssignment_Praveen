"use client";

import { useDebounce } from "@/client/hooks";
import {
  useAvailableItemsOrder,
  useSelectItemsCardOrder,
} from "@/client/store/Order/store";
import { CustomSelectCard } from "@/components/custom/atoms/CustomSelectCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  GetItemsByQuery,
  getMenuId,
  GetMenuItems,
  GetMenuItemsByMenuId,
  GetMenuItemsByQuery,
} from "@/server/serverFn";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";

export function CreateOrder({
  restaurant,
  menuId,
}: {
  restaurant: "america" | "india";
  menuId?: string;
}) {
  const [loading, setLoading] = useState(false);

  // this is for storing the available items from db
  const items = useAvailableItemsOrder((s) => s.availableItems);
  const addItems = useAvailableItemsOrder((s) => s.addItems);
  const filterItems = useAvailableItemsOrder((s) => s.filterItems);
  const clear = useAvailableItemsOrder((s) => s.clear);

  // this is for selecting the card
  const selectedItems = useSelectItemsCardOrder((s) => s.selectedItems);
  const setItems = useSelectItemsCardOrder((s) => s.addSelectedItem);
  const removeItem = useSelectItemsCardOrder((s) => s.removeItem);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    if (!menuId) return;
    (async () => {
      setLoading(true);
      try {
        clear();

        const menuItems = await GetMenuItemsByQuery(
          restaurant,
          menuId,
          debouncedSearch,
        );

        addItems(menuItems);
      } finally {
        setLoading(false);
      }
    })();
  }, [menuId, debouncedSearch, restaurant]);

  return (
    <Card
      className="w-full max-w-[40%] gap-2 pl-3 py-2 rounded-none
        dark:bg-accent/50 bg-neutral-200 shadow-none border border-myborder"
    >
      <CardTitle className="font-medium text-lg">Available Items</CardTitle>
      <CardContent className="p-0 flex flex-col gap-2">
        <div className="w-full">
          <input
            value={searchInput}
            placeholder="Find Items by Name"
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value);
            }}
            className={`rounded-none mr-auto w-[60%] placeholder:text-xs text-sm
              placeholder:pl-1 placeholder:italic focus:outline-none
              focus:bg-zinc-500/20 border border-myborder px-2 py-2`}
          />
        </div>
        <ScrollArea className="h-108 relative w-full">
          {loading && (
            <div
              className="absolute z-30 flex backdrop-blur-md w-full h-full
                items-center justify-center flex-col gap-2"
            >
              <Spinner className="size-5" />
              <span className="text-muted-foreground">Fetching Items</span>
            </div>
          )}
          <div className="pr-3 mr-0 m-0 h-full w-full">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {items.map((item, index) => (
                <CustomSelectCard
                  key={item.id ?? `${item.name}-${item.location}-${index}`}
                  className="rounded-none"
                  name={item.name}
                  cost={item.cost}
                  id={item.id}
                  elapsedTime={item.elapsedTime}
                  location={item.location}
                  menuId={menuId as string}
                  type="order"
                  selectedItems={selectedItems}
                  setOrderItem={setItems}
                  removeItem={removeItem}
                  filterItem={filterItems}
                />
              ))}{" "}
            </div>
          </div>
          <Scrollbar
            className="dark:bg-transparent bg-neutral-500"
            orientation="vertical"
          />
        </ScrollArea>
      </CardContent>{" "}
    </Card>
  );
}
