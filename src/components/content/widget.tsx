import { useExtra } from "@/state/extra";
import { useEffect, useRef, useState } from "react";
import { WIDGET_URL } from "@/config";

export default function WidgetContent({
  configurationId,
  onSubmit,
}: {
  onSubmit?: (state: Record<string, any>) => void;
  configurationId: string;
}) {
  const widgetRef = useRef<HTMLElement>();
  const popupRef = useRef<HTMLElement>();
  const mountRef = useRef<HTMLDivElement>(null);
  const { state } = useExtra();
  const [updateExtra, setUpdateExtra] =
    useState<(extra: Record<string, any>) => void>();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = WIDGET_URL + "main.js";
    script.async = true;
    script.type = "module";
    let loadedElement: HTMLElement;

    script.onload = () => {
      // @ts-ignore
      window.deeto.registerFloatingReferenceWidget().then((dt: any) => {
        dt.element.configurationId = configurationId;
        dt.element.mountTarget = mountRef.current;
        const { element, popupElement, setExtra } = dt.mountWidget(
          mountRef.current,
        ) as {
          element: HTMLElement;
          popupElement: HTMLElement;
          setExtra: (extra: Record<string, any>) => void;
        };
        customElements.whenDefined(`deeto-floating-reference`).then(() => {
          const widgetStyle = document.createElement('style');
          widgetStyle.innerHTML = `
            .cursor-pointer.fixed {
              bottom: 140px;
            }
            .dt-floater-container {
              bottom: 120px;
            }`;
          element.shadowRoot?.appendChild(widgetStyle);
        });

        setUpdateExtra(() => setExtra);

        loadedElement = element;
        widgetRef.current = loadedElement;
        popupRef.current = popupElement;
      });
    };

    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
        document.body.removeChild(loadedElement);
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!updateExtra) return;

    onSubmit?.(state);
    updateExtra(state);

    if (state.fonts) {
      const createFontLink = (url: string) => {
        const link = document.createElement("style");
        link.id = "font-link";
        link.textContent = `
            @import url('${url}');
        `;
        return link;
      };

      const oldLinks = document.body.querySelectorAll("-link");

      oldLinks?.forEach((link) => {
        try {
          document.body.removeChild(link);
        } catch {}
      });

      state.fonts.forEach((link: string) => {
        document.body.appendChild(createFontLink(link));
      });
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

    const oldTemplateWidget =
      widgetRef.current?.shadowRoot?.getElementById("widget-styles");
    const oldTemplatePopup =
      popupRef.current?.shadowRoot?.getElementById("widget-styles");

    if (oldTemplateWidget) {
      widgetRef.current?.shadowRoot?.removeChild(oldTemplateWidget);
    }

    if (oldTemplatePopup) {
      popupRef.current?.shadowRoot?.removeChild(oldTemplatePopup);
    }

    // TODO
    template.innerHTML = `* {
      ${styles}
      }`;

    widgetRef.current?.shadowRoot?.appendChild(template);
    popupRef.current?.shadowRoot?.appendChild(template);
  }, [state, updateExtra]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full bg-widget-background flex flex-col gap-8 p-10"
    >
      <div className="border-[10px] border-white border-opacity-10 flex-1 rounded-2xl" />
      <div className="flex-1 gap-10 flex flex-col">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex flex-1 flex-wrap gap-10">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-1 border-[10px] border-white border-opacity-10 rounded-2xl"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
