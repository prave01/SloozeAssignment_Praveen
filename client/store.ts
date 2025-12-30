import { CreateItemType } from "@/server/zod-schema";
import { create } from "zustand";

type ItemObjectStore = {
  itemsState: Array<CreateItemType>;
  setItems: (buffer: Array<CreateItemType>) => void;
};

export const useItem = create<ItemObjectStore>((set) => ({
  itemsState: [],
  setItems: (buffer) => set({ itemsState: buffer }),
}));
