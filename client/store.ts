import { item } from "@/lib/database";
import { CreateItemType } from "@/server/zod-schema";
import { create } from "zustand";

type ItemObjectStore = {
  itemsState: Array<CreateItemType>;
  setItems: (buffer: Array<CreateItemType>) => void;
  removeItems: (items: { itemId: string }[]) => void;
};

export const useItem = create<ItemObjectStore>((set) => ({
  itemsState: [],
  setItems: (buffer) => set({ itemsState: buffer }),
  removeItems: (items) =>
    set((state) => {
      const idsToRemove = new Set(items.map((i) => i.itemId));
      return {
        itemsState: state.itemsState.filter(
          (item) => !idsToRemove.has(item.id as string),
        ),
      };
    }),
}));

type SelectItemsStore = {
  selectedItemIds: Map<string, string>;
  addItem: (itemId: string, menuId: string) => void;
  removeItem: (items: { itemId: string }[]) => void;
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

  removeItem: (items) =>
    set((state) => {
      const next = new Map(state.selectedItemIds);

      for (const { itemId } of items) {
        next.delete(itemId);
      }

      return { selectedItemIds: next };
    }),

  clear: () => set({ selectedItemIds: new Map() }),
}));
