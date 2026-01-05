"use client";

import { useMenuItems } from "@/client/store/Menu/store";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  DeleteMenuItemByMenuId,
  GetMenuItemsByMenuId,
} from "@/server/serverFn";
import { Trash2Icon, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function MenuItems({ menuId }: { menuId: string }) {
  const [loading, setLoading] = useState(false);

  const menuItems = useMenuItems((s) => s.menuItems);
  const setMenuItems = useMenuItems((s) => s.setMenuItems);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const result = await GetMenuItemsByMenuId(menuId);
      setMenuItems(result);
    } catch (err: any) {
      toast.error("Failed to fetch menu items", {
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemName: string, itemId: string) => {
    try {
      setLoading(true);
      await DeleteMenuItemByMenuId(menuId, itemId);
      await fetchMenuItems();
      toast.success(`Item ${itemName} deleted successfully`);
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [menuId]);

  return (
    <div className="group w-1/3 h-full flex flex-col gap-2">
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg flex items-center
          justify-between"
      >
        <span>Menu Items</span>

        <Button
          size="icon"
          variant="ghost"
          onClick={fetchMenuItems}
          disabled={loading}
          className="h-7 w-7"
        >
          <RefreshCcw
            className={`size-4 transition-transform ${loading ? "animate-spin" : ""
              }`}
          />
        </Button>
      </CardTitle>

      <CardContent
        className="w-full h-full border border-myborder overflow-y-auto
          no-scrollbar p-2 relative"
      >
        {loading && (
          <div
            className="absolute flex items-center justify-center
              backdrop-blur-sm w-full h-full"
          >
            <Spinner className="size-5" />
          </div>
        )}

        {!loading && menuItems.length === 0 && (
          <div
            className="absolute flex items-center justify-center
              backdrop-blur-sm w-full h-full"
          >
            <p className="text-sm text-muted-foreground">
              No items added to this menu
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full h-55">
          {menuItems.map(({ item }) => (
            <div
              key={item.id}
              className="w-full h-11 rounded-md px-3 py-1 bg-accent flex
                items-center justify-between"
            >
              <div className="flex items-center text-sm divide-x divide-primary/10">
                <p className="px-2 font-semibold">{item.name}</p>

                <p className="px-2">
                  Cost -
                  <span className="text-primary/60 ml-1">
                    {item.location === "america"
                      ? `$${item.cost}`
                      : `₹${item.cost}`}
                  </span>
                </p>

                <p className="px-2 text-primary/60 capitalize">
                  {item.location}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(item.name, item.id)}
                className="hover:bg-red-500/10"
              >
                <Trash2Icon className="text-red-500 size-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
}
