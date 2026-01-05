"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreateItemType } from "@/server/zod-schema";
import { ClassNameValue } from "tailwind-merge";
import { CheckCircle2, Clock, DollarSign, X, Trash2 } from "lucide-react";
import { DeleteAvailableItem } from "@/server/serverFn";
import { toast } from "sonner";
import { useState } from "react";
import { useAvailableItems } from "@/client/store/Menu/store";
import Image from "next/image";

export function CustomSelectCard({
  name,
  cost,
  elapsedTime,
  image,
  location,
  id,
  menuId,
  className,
  type,
  selectedItems,
  setCardItem,
  setOrderItem,
  removeItem,
  filterItem,
}: CreateItemType & {
  menuId: string;
  className?: ClassNameValue;
  type: "order" | "menu";
  selectedItems: Map<string, string | (CreateItemType & { quantity: number })>;
  setCardItem?: (buffer: { itemId: string; menuId: string }[]) => void;
  setOrderItem?: (
    buffer: { itemId: string; item: CreateItemType & { quantity: number } }[],
  ) => void;
  removeItem: (buffer: { itemId: string }[]) => void;
  filterItem?: (buffer: { itemId: string }[]) => void;
}) {
  const isSelected = selectedItems.has(id as string);
  const currencySymbol = location === "india" ? "₹" : "$";
  const formattedTime =
    Number(elapsedTime) >= 60
      ? `${Math.floor(Number(elapsedTime) / 60)} Hr`
      : `${elapsedTime}`;

  const [isDeleting, setIsDeleting] = useState(false);
  const filterItemsStore = useAvailableItems((s) => s.filterItems);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await DeleteAvailableItem(id as string);
      toast.success("Item deleted successfully");

      if (type === "menu") {
        filterItemsStore([{ itemId: id as string }]);
      } else if (filterItem) {
        filterItem([{ itemId: id as string }]);
      }
    } catch (err) {
      toast.error("Failed to delete item");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelect = () => {
    if (type === "menu") {
      if (!selectedItems.has(id as string) && setCardItem) {
        setCardItem([{ itemId: id as string, menuId }]);
        return;
      }
      removeItem([{ itemId: id as string }]);
      return;
    }
    if (!selectedItems.has(id as string) && setOrderItem && filterItem) {
      setOrderItem([
        {
          itemId: id as string,
          item: { name, cost, id, elapsedTime, location, image, quantity: 0 },
        },
      ]);
      filterItem([{ itemId: id as string }]);
      return;
    }
    removeItem([{ itemId: id as string }]);
  };

  return (
    <Card
      onClick={handleSelect}
      className={cn(
        `relative rounded-xl flex flex-row overflow-hidden
        border-border cursor-pointer transition-all duration-300
        hover:shadow-lg group h-28 bg-card p-2 gap-2`,
        isSelected
          ? "border-primary ring-1 ring-primary bg-primary/5 shadow-md"
          : "hover:border-primary/50 hover:bg-accent/5",
        className,
      )}
    >
      {/* Delete Button */}
      {type === "menu" && (
        <div
          onClick={handleDelete}
          className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:border-destructive hover:text-destructive-foreground transition-colors shadow-sm">
            {isDeleting ? (
              <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <X className="size-3" />
            )}
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute right-2 bottom-2 z-10">
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
            <CheckCircle2 className="size-3 text-primary-foreground" />
          </div>
        </div>
      )}

      {/* Content section (Left) */}
      <div className="flex flex-col justify-between bg-transparent flex-1">
        <div className="flex flex-col gap-1">
          {/* Name */}
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Location Badge */}
          <div className="flex">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70 bg-secondary/50 px-1.5 py-0.5 rounded">
              {location}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-2 pt-2 mt-auto">
          {/* Price */}
          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
            <span className="text-muted-foreground">{currencySymbol}</span>
            {cost}
          </div>

          <div className="h-3 w-[1px] bg-border" />

          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Image section (Right) */}
      <div className="relative rounded-sm w-28 h-full overflow-hidden bg-muted ">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
            <p className="text-2xl font-bold text-muted-foreground/30 select-none">
              {name?.split("")[0]?.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
