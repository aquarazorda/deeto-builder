import { create } from "zustand";

type PanelState = {
  active: string;
  set: (active: string) => void;
};

export const usePanel = create<PanelState>((set) => ({
  active: "logo",
  set: (active: string) => {
    set((state) => (state.active != active ? { ...state, active } : state));
  },
}));
