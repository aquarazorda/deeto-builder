import { create } from "zustand";
import { ROOT_URL } from "@/config";

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

export type Metadata = {
  contentEditables?: string[];
  list: Element[];
};

type PanelState = {
  active?: string;
  metadata?: Metadata;
  set: (active: string) => void;
  loadMetadata: (metadata?: Metadata) => Promise<void>;
  saveImage?: (name: string, blob: Blob) => Promise<string>;
  setSaveImgFn: (fn: (name: string, blob: Blob) => Promise<string>) => void;
};

export const usePanel = create<PanelState>((set) => ({
  setSaveImgFn: (fn) => {
    set((state) => ({ ...state, saveImage: fn }));
  },
  set: (active: string) => {
    set((state) => (state.active != active ? { ...state, active } : state));
  },
  loadMetadata: async (metadata?: Metadata) => {
    const res =
      metadata ??
      (await fetch(ROOT_URL + "/metadata.json").then(
        (res) => res.json() as Promise<Metadata>,
      ));
    set((state) => ({ ...state, metadata: res }));
  },
}));
