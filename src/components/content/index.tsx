import { useHtml } from "@/state/html";
import { useNavbar } from "@/state/navbar";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

const listener = (setNavbar: (active: string) => void) => (e: Event) => {
  const clickedElement = e?.composedPath()?.[0] as unknown as Element;
  if (clickedElement) {
    if (clickedElement.attributes.getNamedItem("alt")?.value === "logo") {
      setNavbar("logo");
      return;
    }
  }
};

export default function Content() {
  const [html, loadHtml] = useHtml(
    useShallow((state) => [state.html, state.loadHtml]),
  );
  const [setNavbar] = useNavbar(useShallow((state) => [state.set]));

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
        shadowRoot.addEventListener("click", listener(setNavbar));
      }
    }

    return () =>
      shadowHost.current?.removeEventListener("click", listener(setNavbar));
  }, [html]);

  return <div className="w-2/3" ref={shadowHost} />;
}
