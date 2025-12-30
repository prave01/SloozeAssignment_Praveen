import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateItemClient } from "../../molecules/Menu/CreateItem/CreateItemClient";
import { ShowAvailableItems } from "../../molecules/Menu/ShowAvailableItems/ShowAvailableItems";
import { AddMenuItems } from "../../molecules/Menu/AddMenuItems/AddMenuItems";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { useState } from "react";

export function MenuItemsPage() {
  const [location, setLocation] = useState<"america" | "india">("india");
  return (
    <div className="w-full h-full p-20">
      <Card
        className="p-0 max-h-full h-full rounded-none w-full shadow-none flex
          flex-col bg-transparent border-none backdrop-blur-sm gap-2"
      >
        <CardTitle
          className="border-myborder flex items-center justify-between border
            py-2 px-3 text-xl"
        >
          Add Menu Items
          <Select
            required
            value={location}
            onValueChange={(value) => setLocation(value as "india" | "america")}
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
        </CardTitle>
        <CardContent
          className="border-myborder flex gap-4 p-4 h-full w-full
          border"
        >
          <CreateItemClient restaurant={location} />
          <ShowAvailableItems restaurant={location} />
          <AddMenuItems />
        </CardContent>
      </Card>
    </div>
  );
}
