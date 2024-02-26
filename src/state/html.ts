import { create } from "zustand";
import { load, CheerioAPI } from "cheerio";
import { parseStyleTag, styleTagToString, swapStyleTag } from "./styles";
import { toast } from "sonner";

type Styles = Record<string, Record<string, string>>;

type HtmlState = {
  $: CheerioAPI;
  html: string;
  history: string[];
  currentIdx: number;
  styles: Styles;
  swapStyles: (styles: Styles) => void;
  loadHtml: () => Promise<void>;
  setHtml: (html: CheerioAPI) => void;
  undo: () => void;
  redo: () => void;
  save: () => void;
};

export const useHtml = create<HtmlState>((set) => ({
  $: load(""),
  html: "",
  history: [],
  currentIdx: 0,
  styles: {},
  save: () =>
    set((state) => {
      toast.success("Changes successfully saved!");

      return {
        ...state,
        history: [state.html],
        currentIdx: 0,
      };
    }),
  swapStyles: (styles: Styles) =>
    set((state) => {
      const str = styleTagToString(styles);
      const html = swapStyleTag(state.html, str);

      return {
        ...state,
        styles,
        html,
        $: load(html),
        history: [...state.history, html],
        currentIdx: state.currentIdx + 1,
      };
    }),
  undo: () =>
    set((state) => ({
      ...state,
      currentIdx: state.currentIdx - 1,
      html: state.history[state.currentIdx - 1],
      styles: parseStyleTag(state.history[state.currentIdx - 1]),
    })),
  redo: () =>
    set((state) => ({
      ...state,
      currentIdx: state.currentIdx + 1,
      html: state.history[state.currentIdx + 1],
      styles: parseStyleTag(state.history[state.currentIdx + 1]),
    })),
  loadHtml: async () => {
    const html = await fetch("/template.html").then((res) => res.text());
    set((state) => ({
      ...state,
      html,
      $: load(html),
      history: [html],
      styles: parseStyleTag(html),
    }));
  },
  setHtml: ($) => {
    const html = $.html();
    set((state) => ({
      ...state,
      $,
      html: $.html(),
      currentIdx: state.currentIdx + 1,
      history: [...state.history, html],
      styles: parseStyleTag(html),
    }));
  },
}));
