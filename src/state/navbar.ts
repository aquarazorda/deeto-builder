import { create } from "zustand";

type NavbarState = {
  active: string;
  set: (active: string) => void;
};

export const useNavbar = create<NavbarState>((set) => ({
  active: "logo",
  set: (active: string) => {
    set((state) => (state.active != active ? { ...state, active } : state));
  },
}));
