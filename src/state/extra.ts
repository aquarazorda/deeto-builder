import { create } from "zustand";

type Extra = {
  state?: Record<string, any>;
  set: (state: Record<string, any>) => void;
};

export const useExtra = create<Extra>((set) => ({
  set,
}));
