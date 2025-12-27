"use client";

import { CreateItem } from "@/components/custom/templates/CreateItem";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="max-h-[90%] h-full px-20 w-full py-10">
        <Card
          className="p-0 rounded-none w-full shadow-none h-full bg-transparent
            border-none backdrop-blur-sm gap-2"
        >
          <CardTitle className="border-myborder border py-2 px-3 text-xl">
            Add Menu Items
          </CardTitle>
          <CardContent className="border-myborder flex gap-4 p-4 w-full h-full border">
            <CreateItem />
            <div
              tabIndex={0}
              className="group w-1/3 h-full flex flex-col gap-2�
                focus:outline-none"
            >
              <CardTitle
                className="border border-myborder py-1 px-3 text-lg
                  transition-all duration-200
                  group-focus-within:border-blue-500/40"
              >
                Add Menu Items
              </CardTitle>

              <CardContent
                className="w-full h-full border border-myborder transition-all
                  duration-200 group-focus-within:border-blue-500/40"
              />
            </div>

            <div
              tabIndex={0}
              className="group w-1/3 h-full flex flex-col gap-2
                focus:outline-none"
            >
              <CardTitle
                className="border border-myborder py-1 px-3 text-lg
                  transition-all duration-200
                  group-focus-within:border-blue-500/40"
              >
                Add Menu Items
              </CardTitle>

              <CardContent
                className="w-full h-full border border-myborder transition-all
                  duration-200 group-focus-within:border-blue-500/40"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
