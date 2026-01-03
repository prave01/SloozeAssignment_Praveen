import { create } from "zustand";

type SelectItems = {
  selectedItems: Map<string, string>;
  addSelectedItem: (itemId: string, menuId: string) => void;
  removeSelectedItem: (itemId: string) => void;
  clear: () => void;
};

export const useOrderSelectItems = create<SelectItems>((set) => ({
  selectedItems: new Map(),
  addSelectedItem: (itemId, menuId) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      next.set(itemId, menuId);
      return {
        selectedItems: next,
      };
    }),
  removeSelectedItem: (itemId) =>
    set((state) => {
      const next = new Map(state.selectedItems);
      next.delete(itemId);
      return {
        selectedItems: next,
      };
    }),
  clear: () => set({ selectedItems: new Map() }),
}));

type OnboardOrderItems = {
  onboardItems: Map<string, string>;
  addOnboardItem: (itemId: string, menuId: string) => void;
  removeOnboardItem: (itemId: string) => void;
  clear: () => void;
};

export const useOnboardItems = create<OnboardOrderItems>((set) => ({
  onboardItems: new Map(),
  addOnboardItem: (itemId, menuId) =>
    set((state) => {
      const next = new Map(state.onboardItems);
      next.set(itemId, menuId);
      return {
        onboardItems: next,
      };
    }),
  removeOnboardItem: (itemId) =>
    set((state) => {
      const next = new Map(state.onboardItems);
      next.delete(itemId);
      return {
        onboardItems: next,
      };
    }),
  clear: () => {
    set({ onboardItems: new Map() });
  },
}));
