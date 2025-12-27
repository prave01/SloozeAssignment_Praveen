import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { X } from "lucide-react";
import Image from "next/image";

export function HoverPreview({
  item = "Pizza",
  time = "10 min",
  image = "https://github.com/vercel.png",
  cost = "100",
}: {
  item: string;
  time: string;
  image: string;
  cost: string;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="underline underline-offset-4">
          {item}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <div className="flex justify-between gap-4">
          <Avatar className="size-25 rounded-sm">
            <Image
              src={image}
              alt={""}
              width={500}
              height={500}
              className="rounded-none:wa"
            />
            <AvatarFallback className="rounded-sm">
              <p className="text-4xl font-semibold">
                {item?.toUpperCase().split("")[0]}
              </p>
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{item}</h4>
            <p className="text-sm text-muted-foreground">
              Cost - <span className="text-foreground">{cost}</span>
            </p>
            <div className="text-muted-foreground text-xs">
              Cooking time - <span className="text-foreground">{time}</span>
            </div>
            <div className="flex w-full gap-2">
              <Button className="w-full cursor-pointer flex-1 p-0 h-auto">
                Edit
              </Button>
              <Button
                variant={"destructive"}
                className="cursoir-pointer w-auto h-auto"
              >
                <X />
              </Button>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
