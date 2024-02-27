import * as v from "valibot";

const StorageSchema = v.object({
  layout: v.optional(v.tuple([v.number(), v.number()]), [80, 20]),
  activeTab: v.optional(v.string()),
});

const storage = {
  layout: localStorage.getItem("layout")
    ? JSON.parse(localStorage.getItem("layout")!)
    : [],
  activeTab: JSON.parse(localStorage.getItem("activeTab")) || "",
};

export const useLocalStorage = () => {
  const res = v.safeParse(StorageSchema, storage);

  return {
    ...(res.success ? res.output : v.getDefaults(StorageSchema)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
};
