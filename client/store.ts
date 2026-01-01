import { CreateItemType } from "@/server/zod-schema";
import { set } from "zod";
import { create } from "zustand";

type ItemObjectStore = {
  itemsState: Array<CreateItemType>;
  setItems: (buffer: Array<CreateItemType>) => void;
};

export const useItem = create<ItemObjectStore>((set) => ({
  itemsState: [],
  setItems: (buffer) => set({ itemsState: buffer }),
}));

type SelectItemsStore = {
  selectedItemIds: Set<string>;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useSelectItems = create<SelectItemsStore>((set) => ({
  selectedItemIds: new Set(),

  addItem: (id) =>
    set((state) => {
      const next = new Set(state.selectedItemIds);
      next.add(id);
      return { selectedItemIds: next };
    }),

  removeItem: (id) =>
    set((state) => {
      const next = new Set(state.selectedItemIds);
      next.delete(id);
      return { selectedItemIds: next };
    }),

  clear: () => set({ selectedItemIds: new Set() }),
}));
