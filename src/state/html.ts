import { create } from "zustand";
import { load, CheerioAPI } from "cheerio";
import { parseStyleTag, styleTagToString, swapStyleTag } from "./styles";
import { toast } from "sonner";
import { ROOT_URL } from "@/config";
import { MutableRefObject } from "react";

type Styles = Record<string, Record<string, string>>;

type HtmlState = {
  $: CheerioAPI;
  html: string;
  history: string[];
  currentIdx: number;
  styles: Styles;
  parentMutableHtml?: MutableRefObject<string>;
  swapStyles: (styles: Styles) => void;
  loadHtml: (htmlUrl?: string) => Promise<void>;
  setHtml: (html: CheerioAPI) => void;
  setParentMutableHtml: (html: MutableRefObject<string>) => void;
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
  setParentMutableHtml: (html: MutableRefObject<string>) =>
    set((state) => ({ ...state, parentMutableHtml: html })),
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
  loadHtml: async (htmlUrl?: string) => {
    const html = await fetch(htmlUrl ?? ROOT_URL + "/template.html")
      .then((res) => res.text())
      .then((html) => html.replace(/\/html_builder/g, ROOT_URL));
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
    set((state) => {
      if (state.parentMutableHtml) {
        state.parentMutableHtml.current = html;
      }

      return {
        ...state,
        $,
        html: $.html(),
        currentIdx: state.currentIdx + 1,
        history: [...state.history, html],
        styles: parseStyleTag(html),
      };
    });
  },
}));
