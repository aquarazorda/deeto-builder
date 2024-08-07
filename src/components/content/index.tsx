import { useHtml } from "@/state/html";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/local-storage";
import { CheerioAPI, load } from "cheerio";
import useDebouncedCallback from "@/lib/debounced-callback";
import { onClickMutatorListener } from "./listeners";
import { usePanel } from "@/state/panel";
import morphdom from "morphdom";
import { useExtra } from "@/state/extra";

const contentEditableListener =
  (
    el: Element,
    index: number,
    $: CheerioAPI,
    setHtml: (api: CheerioAPI) => void,
  ) =>
  () => {
    // @ts-expect-error it will have text
    $($("[contenteditable]")?.get(index)).text(el.textContent);
    setHtml($);
  };

export default function Content({
  htmlUrl,
  setHtml: setHtmlParent,
}: {
  htmlUrl?: string;
  setHtml?: (html: string) => void;
}) {
  const { mobileMode } = useLocalStorage();
  const state = useExtra(useShallow((state) => state.state));
  const meta = usePanel(useShallow((state) => state.metadata));
  const [docHtml, setDocHtml] = useState("");
  const [html, $, loadHtml, setMutable, setHtml] = useHtml(
    useShallow((state) => [
      state.html,
      state.$,
      state.loadHtml,
      state.setParentHtmlSetter,
      state.setHtml,
    ]),
  );
  const debouncedSetHtml = useDebouncedCallback(setHtml, 800);

  const iframeHost = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!docHtml && html) {
      setDocHtml(html);
    }
  }, [html]);

  useEffect(() => {
    loadHtml(htmlUrl).then(({ html, set }) => {
      const $ = load(
        html.replace(/\{\{\s*vendorName\s*\}\}/g, state?.vendor?.name),
      );

      if (!$("#logo").attr("src") && state?.vendor?.appLogo?.url) {
        $("#logo").attr("src", state.vendor.appLogo.url);
      }

      if (meta?.contentEditables?.length) {
        meta.contentEditables.forEach((selector) => {
          $(selector).attr("contenteditable", "");
        });
      }

      const htmlTransformed = $.html();
      set((state) => ({
        ...state,
        html: htmlTransformed,
        $,
      }));
    });
  }, [htmlUrl, meta]);

  useEffect(() => {
    setHtmlParent && setMutable(setHtmlParent);
  }, [setHtmlParent]);

  useEffect(() => {
    const listeners: {
      name: string;
      fn: () => void;
      el: HTMLElement | Element;
    }[] = [];

    if (iframeHost && $) {
      const doc = iframeHost.current?.contentDocument?.documentElement;
      if (doc && doc.getElementsByTagName("body").length) {
        morphdom(doc, $.html());

        const editables = doc.querySelectorAll("[contenteditable]");
        editables.forEach((editable, idx) => {
          const fn = contentEditableListener(
            editable,
            idx,
            $,
            debouncedSetHtml,
          );

          editable.addEventListener("input", fn);
          listeners.push({ name: "input", fn, el: editable });
        });

        doc.querySelectorAll("[onclick]").forEach((el) => {
          el.addEventListener("click", onClickMutatorListener(doc, setHtml));
          listeners.push({
            name: "click",
            fn: onClickMutatorListener(doc, setHtml),
            el,
          });
        });
      }
    }

    return () => {
      listeners.forEach(({ name, fn, el }) => el.removeEventListener(name, fn));
    };
  }, [$, html]);

  return (
    <div className="flex w-full items-center justify-center">
      <iframe
        className={cn(
          "relative w-full h-[calc(100dvh-72px)]",
          mobileMode && "p-14 w-[570px] h-[832px]",
        )}
        ref={iframeHost}
        srcDoc={docHtml}
      ></iframe>
    </div>
  );
}
