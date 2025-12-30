import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface SelectedCard {
  itemName: string;
}

export function CustomSelectCard({
  selectedCards,
  itemName,
  cost,
  elapsedTime,
  image,
}: {
  selectedCards: SelectedCard[];
  itemName: string;
  cost: number;
  elapsedTime: string;
  image: string;
}) {
  const selectHandle = () => {
    selectedCards.push({ itemName });
    console.log("Currently selected cards:", selectedCards);
  };

  return (
    <Card
      onClick={selectHandle}
      className="rounded-md gap-2 flex flex-row p-2 items-start w-full h-fit
        border-myborder"
    >
      <div className="flex-1 flex flex-col gap-1 h-full rounded-sm">
        <p className="rounded-sm font-semibold px-2 py-1 text-sm bg-black w-fit">
          {itemName}
        </p>
        <div className="flex flex-col gap-1 pl-2">
          <p className="text-xs text-amber-100 font-semibold mt-1">
            Cost -{" "}
            <span className="text-primary font-medium">{cost || ""}</span>
          </p>
          <p className="text-xs text-amber-100 font-semibold mt-1">
            Elapsed Time -{" "}
            <span className="text-primary font-medium">{elapsedTime}</span>
          </p>
        </div>
      </div>
      <Avatar className="size-20 rounded-sm">
        <AvatarImage src={image} className="rounded-sm" />
        <AvatarFallback className="rounded-sm">
          <p className="text-4xl font-semibold">
            {itemName.split("")[0].toUpperCase()}
          </p>
        </AvatarFallback>
      </Avatar>
    </Card>
  );
}
