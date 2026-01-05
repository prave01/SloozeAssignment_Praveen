import { create } from "zustand";

type DashboardLocation = {
    location: "america" | "india";
    setLocation: (location: "america" | "india") => void;
};

export const useDashboardLocation = create<DashboardLocation>((set) => ({
    location: "america",
    setLocation: (location) => set({ location }),
}));
