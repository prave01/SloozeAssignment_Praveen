import { CreateItemType } from "@/server/zod-schema";
import { create } from "zustand";

type ItemObjectStore = {
  itemsState: Array<CreateItemType>;
  setItems: (buffer: Array<CreateItemType>) => void;
  removeItem: (itemId: string) => void;
};

export const useItem = create<ItemObjectStore>((set) => ({
  itemsState: [],
  setItems: (buffer) => set({ itemsState: buffer }),
  removeItem: (itemId) =>
    set((state) => ({
      itemsState: state.itemsState.filter((item) => item.id !== itemId),
    })),
}));

type SelectItemsStore = {
  selectedItemIds: Map<string, string>;
  addItem: (itemId: string, menuId: string) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
};

export const useSelectItems = create<SelectItemsStore>((set) => ({
  selectedItemIds: new Map(),
  addItem: (itemId, menuId) =>
    set((state) => {
      const next = new Map(state.selectedItemIds);
      next.set(itemId, menuId);
      return { selectedItemIds: next };
    }),
  removeItem: (itemId) =>
    set((state) => {
      const next = new Map(state.selectedItemIds);
      next.delete(itemId);
      return { selectedItemIds: next };
    }),
  clear: () => set({ selectedItemIds: new Map() }),
}));
