import { useHtml } from "@/state/html";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { innerHTML } from "diffhtml";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/local-storage";
import { CheerioAPI } from "cheerio";
import useDebouncedCallback from "@/lib/debounced-callback";

// const onClickListener = (setPanel: (active: string) => void) => (e: Event) => {
//   const clickedElement = e?.composedPath()?.[0] as unknown as Element;
//   if (clickedElement) {
//     if (clickedElement.attributes.getNamedItem("alt")?.value === "logo") {
//       setPanel("logo");
//       return;
//     }
//
//     match(clickedElement.tagName.toLowerCase()).with("h1", "h2", "p", () =>
//       setPanel("color"),
//     );
//   }
// };

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

  // const [setPanel] = usePanel(useShallow((state) => [state.set]));

  const iframeHost = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadHtml(htmlUrl);
  }, [htmlUrl]);

  useEffect(() => {
    setHtmlParent && setMutable(setHtmlParent);
  }, [setHtmlParent]);

  useEffect(() => {
    const listeners: { name: string; fn: () => void }[] = [];

    if (iframeHost && $) {
      const doc = iframeHost.current?.contentDocument?.documentElement;
      if (doc) {
        innerHTML(doc, $.html());

        const editables = doc.querySelectorAll("[contenteditable]");
        editables.forEach((editable, idx) => {
          const fn = contentEditableListener(
            editable,
            idx,
            $,
            debouncedSetHtml,
          );

          editable.addEventListener("input", fn);
          listeners.push({ name: "input", fn });
        });
        // doc.addEventListener("click", listener(setPanel));
        // listeners.push({ name: "click", fn: listener(setPanel) });
      }
    }

    return () => {
      listeners.forEach(
        ({ name, fn }) => iframeHost.current?.removeEventListener(name, fn),
      );
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
        // srcDoc={html}
      />
    </div>
  );
}
