import { CreateItemType } from "@/server/zod-schema";
import { create } from "zustand";

// store for storing the available data from the db
type AvailableItems = {
  availableItems: Array<CreateItemType>;
  addItems: (buffer: Array<CreateItemType>) => void;
  filterItems: (buffer: { itemId: string }[]) => void;
  clear: () => void;
};

export const useAvailableItems = create<AvailableItems>((set) => ({
  availableItems: [],
  addItems: (buffer) => set({ availableItems: buffer }),
  filterItems: (buffer) =>
    set((state) => {
      const removeIds = new Set(buffer.map((b) => b.itemId));

      return {
        availableItems: state.availableItems.filter(
          (item) => item.id && !removeIds.has(item.id),
        ),
      };
    }),
  clear: () => set({ availableItems: [] }),
}));

// store for selecting cards
type SelectItemCard = {
  selectedItems: Map<string, string>;
  addSelectedItem: (
    buffer: {
      itemId: string;
      menuId: string;
    }[],
  ) => void;
  removeItem: (buffer: { itemId: string }[]) => void;
  clear: () => void;
};

export const useSelectItemsCard = create<SelectItemCard>((set) => ({
  selectedItems: new Map(),
  addSelectedItem: (buffer) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      for (const i of buffer) {
        next.set(i.itemId, i.menuId);
      }
      return { selectedItems: next };
    }),
  removeItem: (buffer) =>
    set((state) => {
      const removeIds = new Set(buffer.map((item) => item.itemId));
      const next = new Map(state.selectedItems);
      for (const id of removeIds) {
        next.delete(id);
      }
      return { selectedItems: next };
    }),

  clear: () => ({ selectedItems: new Map() }),
}));

type SelectItemsStore = {
  selectedItemIds: Map<string, string>;
  addItem: (itemId: string, menuId: string) => void;
  removeItem: (items: { itemId: string }[]) => void;
  clear: () => void;
};

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
