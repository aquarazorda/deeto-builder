import { create } from "zustand";

export type Extra = {
  state: Record<string, any>;
  set: (state: Record<string, any>) => void;
};

export const useExtra = create<Extra>((set) => ({
  set: (state) => set((prev) => ({ ...prev, state })),
  state: {},
}));
