import { CardContent, CardTitle } from "@/components/ui/card";

export function AddMenuItems() {
  return (
    <div className="group w-1/3 h-full flex flex-col gap-2 focus:outline-none">
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg transition-all
          duration-200 group-focus-within:border-blue-500/40"
      >
        Add Menu Items
      </CardTitle>

      <CardContent
        className="w-full h-full border flex items-center justify-center
          border-myborder transition-all px-5 py-8 duration-200
          group-focus-within:border-blue-500/40"
      ></CardContent>
    </div>
  );
}
