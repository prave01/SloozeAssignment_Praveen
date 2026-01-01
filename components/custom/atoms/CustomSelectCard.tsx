"use client";

import { useSelectItems } from "@/client/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreateItemType } from "@/server/zod-schema";

export function CustomSelectCard({
  name,
  cost,
  elapsedTime,
  image,
  location,
  id,
  menuId,
}: CreateItemType & { menuId: string }) {
  const selectedItemIds = useSelectItems((s) => s.selectedItemIds);
  const addItem = useSelectItems((s) => s.addItem);
  const removeItem = useSelectItems((s) => s.removeItem);

  const handleSelect = () => {
    if (!selectedItemIds.has(id as string)) {
      addItem(id as string, menuId);
      return;
    }
    removeItem(id as string);
  };

  return (
    <Card
      onClick={handleSelect}
      className={cn(
        `rounded-md gap-2 flex flex-row p-2 items-start w-full h-fit
        border-myborder cursor-pointer`,
        selectedItemIds.has(id as string) && "border-green-400/50 border",
      )}
    >
      <div className="flex-1 flex flex-col gap-1 h-full rounded-sm">
        <p className="rounded-sm font-semibold px-2 py-1 text-sm bg-accent w-fit">
          {name}
        </p>
        <div className="flex flex-col gap-1 pl-2">
          <p
            className="text-xs text-zinc-950 dark:text-zinc-200 font-semibold
              mt-1"
          >
            Cost -{" "}
            <span className="text-primary font-medium">
              {location === "india" && cost ? `${cost} ₹` : `${cost} $`}
            </span>
          </p>
          <p
            className="text-xs text-zinc-950 dark:text-zinc-200 font-semibold
              mt-1"
          >
            Elapsed Time -{" "}
            <span className="text-primary font-medium">
              {Number(elapsedTime) >= 60
                ? `${Math.floor(Number(elapsedTime) / 60)} Hr`
                : `${elapsedTime} Min`}
            </span>
          </p>
        </div>
      </div>
      <Avatar className="size-20 rounded-sm">
        {image && <AvatarImage src={image} className="rounded-sm" />}
        <AvatarFallback className="rounded-sm">
          <p className="text-4xl font-semibold">
            {name?.split("")[0].toUpperCase()}
          </p>
        </AvatarFallback>
      </Avatar>
    </Card>
  );
}
