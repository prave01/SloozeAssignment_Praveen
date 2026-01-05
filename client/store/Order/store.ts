import { CreateItemType } from "@/server/zod-schema";
import { create } from "zustand";

// store for storing the available data from the db
type AvailableItemsOrder = {
  availableItems: Array<CreateItemType>;
  addItems: (buffer: Array<CreateItemType>) => void;
  appendItem: (buffer: Array<CreateItemType>) => void;
  filterItems: (buffer: { itemId: string }[]) => void;
  clear: () => void;
};

export const useAvailableItemsOrder = create<AvailableItemsOrder>((set) => ({
  availableItems: [],
  addItems: (buffer) => set({ availableItems: buffer }),
  appendItem: (buffer) =>
    set((state) => ({ availableItems: [...state.availableItems, ...buffer] })),
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
  selectedItems: Map<string, CreateItemType & { quantity: number }>;
  addSelectedItem: (
    buffer: {
      itemId: string;
      item: CreateItemType & { quantity: number };
    }[],
  ) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  removeItem: (buffer: { itemId: string }[]) => void;
  clear: () => void;
};

// store for selecting cards
export const useSelectItemsCardOrder = create<SelectItemCard>((set) => ({
  selectedItems: new Map(),
  addSelectedItem: (buffer) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      for (const i of buffer) {
        next.set(i.itemId, i.item);
      }
      return { selectedItems: next };
    }),
  updateQuantity: (itemId, qty) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      const existing = next.get(itemId);

      if (!existing) return state;

      next.set(itemId, {
        ...existing,
        quantity: Math.max(1, qty),
      });

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
  clear: () => set({ selectedItems: new Map() }),
}));
