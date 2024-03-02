import z from "zod";
import { create } from "zustand";

const StorageSchema = z.object({
  layout: z.tuple([z.number(), z.number()]).default([80, 20]),
  activeTab: z.string().optional(),
  mobileMode: z.boolean().default(false),
  adminMode: z.enum(["users", "360"]).default("users"),
});

const getItem = (key: string) =>
  localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key)!)
    : undefined;

const storage = {
  layout: getItem("layout") ?? [80, 20],
  activeTab: getItem("activeTab"),
  mobileMode: getItem("mobileMode") ?? false,
  adminMode: getItem("adminMode") ?? "users",
};

type State = z.infer<typeof StorageSchema> & {
  set: (key: keyof typeof storage, value: unknown) => void;
};

export const useLocalStorage = create<State>((set) => {
  const res = StorageSchema.safeParse(storage);

  if (!res.success) {
    throw new Error(res.error.message);
  }

  return {
    ...res.data,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
      set((state) => ({ ...state, [key]: value }));
    },
  };
});
