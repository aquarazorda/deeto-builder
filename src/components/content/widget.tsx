import { useExtra } from "@/state/extra";
import { useEffect, useRef, useState } from "react";
import { WIDGET_URL } from "@/config";
import { useLocalStorage } from "@/lib/local-storage";
import { cn } from "@/lib/utils";
import { usePanel } from "@/state/panel";

export default function WidgetContent({
  configurationId,
  onSubmit,
}: {
  onSubmit?: (state: Record<string, any>) => void;
  configurationId: string;
}) {
  const widgetRef = useRef<HTMLElement>();
  const popupRef = useRef<HTMLElement>();
  const mountRef = useRef<HTMLIFrameElement>(null);

  const [iframeDoc, setIframeDoc] = useState<Document | undefined | null>(null);
  const { state } = useExtra();
  const { mobileMode } = useLocalStorage();
  const { addAction } = usePanel();

  const [updateExtra, setUpdateExtra] =
    useState<(extra: Record<string, any>) => void>();

  useEffect(() => {
    if (!iframeDoc) return;

    const script = document.createElement("script");
    script.src = WIDGET_URL + "main.js";
    script.async = true;
    script.type = "module";
    let loadedElement: HTMLElement;

    script.onload = () => {
      // @ts-ignore
      iframeDoc.defaultView.deeto
        .registerFloatingReferenceWidget()
        .then((dt: any) => {
          setTimeout(() => {
            dt.element.configurationId = configurationId;
            dt.element.mountTarget = iframeDoc.getElementById("iframe-root");
            const { element, popupElement, setExtra } = dt.mountWidget(
              dt.element.mountTarget,
            ) as {
              element: HTMLElement;
              popupElement: HTMLElement;
              setExtra: (extra: Record<string, any>) => void;
            };

            customElements.whenDefined(`deeto-floating-reference`).then(() => {
              const widgetStyle = document.createElement("style");
              widgetStyle.innerHTML = `
            .cursor-pointer.fixed {
              position: absolute;
            }
            .dt-floater-container {
              bottom: 120px !important;
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
              background-color: #000000ad;
            }
            .dt-embedded-reference-modal-index > div:first-child {
              display: none;
            }`;
                popupElement.shadowRoot?.appendChild(popupStyle);
              });

            setUpdateExtra(() => setExtra);

            document
              .getElementsByTagName("deeto-reference-popup")?.[0]
              ?.remove?.();
            loadedElement = element;
            widgetRef.current = loadedElement;
            popupRef.current = popupElement;
          }, 1000);
        });
    };

    iframeDoc.head.appendChild(script);

    iframeDoc.addEventListener("addAction", (e) => {
      // @ts-ignore
      addAction({
        // @ts-ignore
        [e.detail.action]: e.detail.fn,
      });
    });

    return () => {
      try {
        iframeDoc.head.removeChild(script);
        iframeDoc.head.removeChild(loadedElement);
      } catch {}
    };
  }, [iframeDoc]);

  useEffect(() => {
    if (!updateExtra || !iframeDoc) return;

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

      const oldLinks = iframeDoc.body.querySelectorAll("-link");

      oldLinks?.forEach((link) => {
        try {
          iframeDoc.body.removeChild(link);
        } catch {}
      });

      state.fonts.forEach((link: string) => {
        iframeDoc.body.appendChild(createFontLink(link));
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

    iframeDoc?.getElementById("iframe-root")?.appendChild(template);
    iframeDoc?.getElementById("iframe-root")?.appendChild(templatePopup);
  }, [state, updateExtra, iframeDoc]);

  useEffect(() => {
    const iframeDocument = mountRef.current?.contentDocument;
    setIframeDoc(iframeDocument);
    iframeDocument?.open();
    iframeDocument?.write(`
			<!DOCTYPE html>
			<html lang="en">
						<body id="iframe-root">
			</body>
			</html>
		`);
    iframeDocument?.close();
  }, []);

  return (
    <div className="relative w-full h-full flex overflow-y-auto">
      <div
        className={cn(
          "relative w-full h-full bg-widget-background flex flex-col",
          mobileMode && "mx-auto w-[420px] h-[832px] mt-auto rounded-t-2xl",
        )}
      >
        <div
          className={cn(
            "h-full w-full flex flex-col gap-8 p-10",
            mobileMode && "p-6",
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
        <iframe ref={mountRef} className={cn("absolute w-full h-full")} />
      </div>
    </div>
  );
}
