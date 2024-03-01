import { useHtml } from "@/state/html";
import { usePanel } from "@/state/panel";
import { MutableRefObject, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { match } from "ts-pattern";
import { innerHTML } from "diffhtml";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/local-storage";

const listener = (setPanel: (active: string) => void) => (e: Event) => {
  const clickedElement = e?.composedPath()?.[0] as unknown as Element;
  if (clickedElement) {
    if (clickedElement.attributes.getNamedItem("alt")?.value === "logo") {
      setPanel("logo");
      return;
    }

    match(clickedElement.tagName.toLowerCase()).with("h1", "h2", "p", () =>
      setPanel("color"),
    );
  }
};

export default function Content({
  htmlUrl,
  html: htmlRef,
}: {
  htmlUrl?: string;
  html?: MutableRefObject<string>;
}) {
  const { mobileMode } = useLocalStorage();
  const [html, loadHtml, setMutable] = useHtml(
    useShallow((state) => [
      state.html,
      state.loadHtml,
      state.setParentMutableHtml,
    ]),
  );

  const [setPanel] = usePanel(useShallow((state) => [state.set]));

  const shadowHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHtml(htmlUrl);
  }, [htmlUrl]);

  useEffect(() => {
    htmlRef && setMutable(htmlRef);
  }, [htmlRef]);

  useEffect(() => {
    if (html) {
      const shadowRoot =
        shadowHost.current?.shadowRoot ??
        shadowHost.current?.attachShadow({ mode: "open" });

      if (shadowRoot) {
        innerHTML(shadowRoot, html);
        shadowRoot.addEventListener("click", listener(setPanel));
      }
    }

    return () => {
      shadowHost.current?.removeEventListener("click", listener(setPanel));
    };
  }, [html]);

  return (
    <div className="flex w-full items-center justify-center">
      <div
        className={cn(
          "relative w-full",
          mobileMode && "p-14 w-[530px] h-[832px]",
        )}
        ref={shadowHost}
      />
      ;
    </div>
  );
}
