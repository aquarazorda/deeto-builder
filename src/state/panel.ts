import { create } from "zustand";

export type ItemType = "item" | "group" | "form";
export type Behaviour =
  | "image"
  | "background"
  | "color"
  | "color-background"
  | "text"
  | "font";

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

export type FormItem = {
  type: "form-item";
  key: string;
  title: string;
  defaultLabel: string;
  itemType: "text" | "number";
};

export type FormElement = Form | FormItem;

export type Form = {
  type: "form";
  elements: FormItem[];
} & GeneralItem;

export type Element = Group | Item | FormElement;

type Metadata = Element[];

type PanelState = {
  active?: string;
  metadata: Metadata;
  set: (active: string) => void;
  loadMetadata: () => Promise<void>;
};

export const usePanel = create<PanelState>((set) => ({
  metadata: [],
  set: (active: string) => {
    set((state) => (state.active != active ? { ...state, active } : state));
  },
  loadMetadata: async () => {
    const res = await fetch("/metadata.json").then((res) => res.json());
    set((state) => ({ ...state, metadata: res }));
  },
}));
