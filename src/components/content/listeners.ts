import { CheerioAPI, load } from "cheerio";
import { match } from "ts-pattern";

export const onClickMutatorListener =
  (document: HTMLElement, setHtml: (api: CheerioAPI) => void) => () => {
    setHtml(load(document.innerHTML));
  };

export const onClickSetPanelListener =
  (setPanel: (active: string) => void) => (e: Event) => {
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
