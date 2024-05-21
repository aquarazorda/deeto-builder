import { useExtra } from "@/state/extra";
import { useEffect, useRef } from "react";

export default function WidgetContent() {
  const ref = useRef<HTMLElement>();
  const { state } = useExtra();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://localhost:4173/assets/main.js";
    script.async = true;
    script.type = "module";
    let loadedElement: HTMLElement;

    script.onload = () => {
      // @ts-ignore
      window.deeto.registerFloatingReferenceWidget().then((dt: any) => {
        dt.element.configurationId = "34e32793-22d7-42dd-9a5d-7aea795634d6";
        loadedElement = dt.mountWidget() as HTMLElement;
        ref.current = loadedElement;
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(loadedElement);
    };
  }, []);

  useEffect(() => {
    if (state.fonts) {
      const fonts = Object.keys(state.fonts).map((key) => state.fonts[key]);
    }

    if (!state.variables) {
      return;
    }

    const template = document.createElement("style");
    template.id = "widget-styles";
    const styles = Object.keys(state.variables).reduce(
      (acc: string, variable: string) => {
        return acc + `--${variable}: ${state.variables[variable]};`;
      },
      "",
    );

    if (!styles) return;

    const oldTemplate =
      ref.current?.shadowRoot?.getElementById("widget-styles");

    if (oldTemplate) {
      ref.current?.shadowRoot?.removeChild(oldTemplate);
    }

    // TODO
    template.innerHTML = `.CLASS_34e32793-22d7-42dd-9a5d-7aea795634d6 {
      ${styles}
      }`;

    ref.current?.shadowRoot?.appendChild(template);
  }, [state]);

  return <div className="relative w-full h-full"></div>;
}
