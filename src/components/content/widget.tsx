import { useExtra } from "@/state/extra";
import { useEffect, useRef, useState } from "react";
import { WIDGET_URL } from "@/config";
import { useLocalStorage } from "@/lib/local-storage";
import { cn } from "@/lib/utils";

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
  const { mobileMode } = useLocalStorage();

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
          const widgetStyle = document.createElement("style");
          widgetStyle.innerHTML = `
            .cursor-pointer.fixed {
              bottom: 140px;
              position: absolute;
            }
            .dt-floater-container {
              bottom: 120px;
            }`;
          element.shadowRoot?.appendChild(widgetStyle);
        });

        customElements
          .whenDefined("deeto-floating-reference-popup")
          .then(() => {
            const popupStyle = document.createElement("style");
            popupStyle.innerHTML = `
            .dt-embedded-reference-modal-index {
            width: 100%;
            position: absolute;
            background-color: #00000038;
            }
            .dt-embedded-reference-modal-index > div:first-child {
            display: none;
            }`;
            popupElement.shadowRoot?.appendChild(popupStyle);
          });

        setUpdateExtra(() => setExtra);

        document.getElementsByTagName("deeto-reference-popup")?.[0]?.remove?.();
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

    const templatePopup = document.createElement("style");
    templatePopup.id = "widget-styles";

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

    template.innerHTML = `*{${styles}}`;
    templatePopup.innerHTML = `*{${styles}}`;

    widgetRef.current?.shadowRoot?.appendChild(template);
    popupRef.current?.shadowRoot?.appendChild(templatePopup);
  }, [state, updateExtra]);

  return (
    <div className="w-full h-full flex">
      <div
        ref={mountRef}
        className={cn(
          "relative w-full h-[calc(100dvh-72px)] bg-widget-background flex flex-col gap-8 p-10",
          mobileMode && "mx-auto p-6 w-[320px] h-[832px] mt-auto rounded-t-2xl",
        )}
      >
        <div className="border-[10px] border-white border-opacity-10 flex-1 rounded-2xl" />
        <div className="flex-1 gap-10 flex flex-col">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-wrap gap-10">
              {Array.from({ length: mobileMode ? 1 : 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 border-[10px] border-white border-opacity-10 rounded-2xl"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
