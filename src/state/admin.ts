import { create } from "zustand";

type State = {
  email?: string;
  authenticatedUserId?: string;
  set: ((state: State) => void | State) &
    ((fn: (state: State) => State) => void);
};

export const useAdminState = create<State>((set) => ({
  set,
}));
