import * as v from "valibot";
import { create } from "zustand";

const StorageSchema = v.object({
  layout: v.optional(v.tuple([v.number(), v.number()]), [80, 20]),
  activeTab: v.optional(v.string()),
  mobileMode: v.optional(v.boolean(), false),
});

const getItem = (key: string) =>
  localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key)!)
    : undefined;

const storage = {
  layout: getItem("layout") ?? [],
  activeTab: getItem("activeTab"),
  mobileMode: getItem("mobileMode") ?? false,
};

type State = v.Input<typeof StorageSchema> & {
  set: (key: keyof typeof storage, value: unknown) => void;
};

export const useLocalStorage = create<State>((set) => {
  const res = v.safeParse(StorageSchema, storage);

  return {
    ...(res.success ? res.output : v.getDefaults(StorageSchema)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
      set((state) => ({ ...state, [key]: value }));
    },
  };
});
