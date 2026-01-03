import { CreateItemType } from "@/server/zod-schema";
import { create } from "zustand";

type SelectItemCard = {
  selectedItems: Map<string, CreateItemType>;
  addSelectedItem: (
    buffer: {
      itemID: string;
      item: CreateItemType;
    }[],
  ) => void;
  removeItem: (items: string[]) => void;
  clear: () => void;
};

export const useSelectItemsCard = create<SelectItemCard>((set) => ({
  selectedItems: new Map(),
  addSelectedItem: (buffer) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      for (var i of buffer) {
        next.set(i.itemID, i.item);
      }
      console.log(next);
      return {
        selectedItems: next,
      };
    }),
  removeItem: (buffer) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      for (var i of buffer) {
        next.delete(i);
      }
      return {
        selectedItems: next,
      };
    }),
  clear: () => set({ selectedItems: new Map() }),
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

type MenuItemWithItem = {
  menuId: string;
  itemId: string;
  item: {
    id: string;
    name: string;
    cost: number;
    location: "america" | "india";
    elapsedTime: string;
    image?: string;
  };
};

type MenuItems = {
  menuItems: Array<MenuItemWithItem>;
  setMenuItems: (buffer: Array<MenuItemWithItem>) => void;
};

export const useMenuItems = create<MenuItems>((set) => ({
  menuItems: [],
  setMenuItems: (buffer) => set({ menuItems: buffer }),
}));
