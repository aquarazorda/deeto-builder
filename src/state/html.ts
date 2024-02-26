import { create } from "zustand";
import { load, CheerioAPI } from "cheerio";

type HtmlState = {
  $: CheerioAPI;
  html: string;
  loadHtml: () => Promise<void>;
  setHtml: (html: CheerioAPI) => void;
};

export const useHtml = create<HtmlState>((set) => ({
  $: load(""),
  html: "",
  loadHtml: async () => {
    const html = await fetch("/template.html").then((res) => res.text());
    set((state) => ({ ...state, html, $: load(html) }));
  },
  setHtml: (html) => set((state) => ({ ...state, $: html, html: html() })),
}));
