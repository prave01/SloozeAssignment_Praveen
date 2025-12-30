import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateItemClient } from "../../molecules/Menu/CreateItem/CreateItemClient";
import { ShowAvailableItems } from "../../molecules/Menu/ShowAvailableItems/ShowAvailableItems";
import { AddMenuItems } from "../../molecules/Menu/AddMenuItems/AddMenuItems";

export function MenuItemsPage() {
  return (
    <div className="w-full h-full p-20">
      <Card
        className="p-0 max-h-full h-full rounded-none w-full shadow-none flex
          flex-col bg-transparent border-none backdrop-blur-sm gap-2"
      >
        <CardTitle className="border-myborder border py-2 px-3 text-xl">
          Add Menu Items
        </CardTitle>
        <CardContent
          className="border-myborder flex gap-4 p-4 h-full w-full
          border"
        >
          <CreateItemClient />
          <ShowAvailableItems />
          <AddMenuItems />
        </CardContent>
      </Card>
    </div>
  );
}
