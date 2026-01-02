"use client";

import { CustomSelectCard } from "@/components/custom/atoms/CustomSelectCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function Page() {
  const [location, setLocation] = useState<"america" | "india">("america");
  const [qty, setQty] = useState(1);

  const handleValueChange = async (value: any) => {
    setLocation(value as "india" | "america");
  };

  return (
    <div className="relative z-10 p-40">
      <div className="border border-myborder min-h-100 h-full backdrop-blur-sm">
        <CardTitle
          className="flex flex-col gap-2 items-start text-xl font-semibold
            w-full b"
        >
          <p className="px-2 py-1 w-full border-b border-myborder">
            {" "}
            Create Order
          </p>
          <div className="flex px-2">
            {" "}
            <Select required value={location} onValueChange={handleValueChange}>
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
          </div>
        </CardTitle>
        <CardContent className="p-2 flex flex-row gap-2">
          <Card
            className="w-fit gap-2 pl-3 py-2 rounded-none dark:bg-accent/50
              bg-neutral-200 shadow-none border border-myborder"
          >
            <CardTitle className="font-medium text-lg">
              Available Items
            </CardTitle>
            <CardContent className="p-0">
              <ScrollArea className="h-108 w-fit">
                <div className="pr-3 mr-0 m-0">
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <CustomSelectCard key={i} className="rounded-none" />
                    ))}
                  </div>
                </div>
                <ScrollBar
                  className="dark:bg-transparent bg-neutral-500"
                  orientation="vertical"
                />
              </ScrollArea>
            </CardContent>{" "}
          </Card>
          <Card
            className="rounded-none border max-w-100 w-full border-myborder
              bg-accent/20 px-3 py-2 gap-2"
          >
            <CardTitle className="font-medium text-lg">Order Summary</CardTitle>
            <CardContent className="p-0 flex flex-col gap-2">
              <div className="w-fit">
                Order Id -{" "}
                <span className="font-semibold text-muted-foreground">
                  #10190
                </span>
              </div>
              <div
                className="rounded-md border border-myborder px-3 py-2
                  transition-colors hover:border-primary/40"
              >
                <div className="flex flex-col gap-1 text-sm">
                  <p className="font-medium text-foreground">Pizza</p>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Cost</span>
                    <span className="text-primary">$100 x {qty} = $100</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Location</span>
                    <span className="capitalize">America</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Quantity</span>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-4"
                        disabled={qty <= 1}
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-6 text-center font-medium">{qty}</span>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-4"
                        onClick={() => setQty((q) => q + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>{" "}
            </CardContent>
          </Card>
        </CardContent>
      </div>
    </div>
  );
}
