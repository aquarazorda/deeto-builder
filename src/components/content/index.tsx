import { useHtml } from "@/state/html";
import { usePanel } from "@/state/panel";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { match } from "ts-pattern";

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

export default function Content() {
  const [html, loadHtml] = useHtml(
    useShallow((state) => [state.html, state.loadHtml]),
  );
  const [setPanel] = usePanel(useShallow((state) => [state.set]));

  const shadowHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHtml();
  }, []);

  useEffect(() => {
    if (html) {
      const shadowRoot =
        shadowHost.current?.shadowRoot ??
        shadowHost.current?.attachShadow({ mode: "open" });

      if (shadowRoot) {
        shadowRoot.innerHTML = html;
        shadowRoot.addEventListener("click", listener(setPanel));
      }
    }

    return () =>
      shadowHost.current?.removeEventListener("click", listener(setPanel));
  }, [html]);

  return <div className="relative w-full" ref={shadowHost} />;
}
