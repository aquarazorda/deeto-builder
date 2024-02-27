import { create } from "zustand";

export type ItemType = "item" | "group";
export type Behaviour = "image" | "background" | "color" | "color-background";

type GeneralItem = {
  type: ItemType;
  title: string;
  description?: string;
};

export type Group = {
  type: "group";
  elements: Element[];
} & GeneralItem;

export type Item = {
  type: "item";
  behaviour: Behaviour;
  selectors: string[];
  defaultValue: string;
} & GeneralItem;

export type Element = Group | Item;

type Metadata = Element[];

type PanelState = {
  active: string;
  metadata: Metadata;
  set: (active: string) => void;
  loadMetadata: () => Promise<void>;
};

export const usePanel = create<PanelState>((set) => ({
  active: "logo",
  metadata: [],
  set: (active: string) => {
    set((state) => (state.active != active ? { ...state, active } : state));
  },
  loadMetadata: async () => {
    const res = await fetch("/metadata.json").then((res) => res.json());
    console.log(res);
    set((state) => ({ ...state, metadata: res }));
  },
}));
