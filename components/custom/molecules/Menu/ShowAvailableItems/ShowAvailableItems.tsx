import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function ShowAvailableItems() {
  return (
    <div className="group w-1/3 h-full flex flex-col gap-2 focus:outline-none">
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg transition-all
          duration-200 group-focus-within:border-blue-500/40"
      >
        Available Items
      </CardTitle>

      <CardContent
        className="w-full h-full border flex items-start justify-center
          border-myborder transition-all p-3 duration-200
          group-focus-within:border-blue-500/40"
      >
        <div className="grid grid-cols-2 w-full gap-2">
          {" "}
          <Card
            className="rounded-md gap-2 flex flex-row p-2 items-start w-full
              h-full border-myborder"
          >
            <div className="flex-1 flex flex-col gap-1 px-1 h-full rounded-sm">
              <p
                className="rounded-sm font-semibold text-sm bg-black px-2 w-fit
                  p-1"
              >
                Pizza
              </p>
              <div className="flex flex-col gap-1 pl-1">
                <p className="text-xs text-amber-100 font-semibold mt-1">
                  Cost - <span className="text-primary font-medium">100</span>
                </p>
                <p className="text-xs text-amber-100 font-semibold mt-1">
                  Elapsed Time -{" "}
                  <span className="text-primary font-medium">100</span>
                </p>
              </div>
            </div>
            <Avatar className="size-20 rounded-sm">
              <Image
                src="https://github.com/vercel.png"
                alt={""}
                width={500}
                height={500}
                className="rounded-none:wa"
              />
              <AvatarFallback className="rounded-sm">
                <p className="text-4xl font-semibold">P</p>
              </AvatarFallback>
            </Avatar>
          </Card>
          <Card className="rounded-md border-myborder"></Card>
        </div>
      </CardContent>
    </div>
  );
}
