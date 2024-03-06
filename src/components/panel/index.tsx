import { Element, Group, Metadata, usePanel } from "@/state/panel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useShallow } from "zustand/react/shallow";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import ItemGenerator from "./item-generator";
import { useLocalStorage } from "@/lib/local-storage";
import { useHtml } from "@/state/html";
import { load as loadCheerio } from "cheerio";
import { match } from "ts-pattern";

type Props = {
  metadata?: Metadata;
  saveImage?: (name: string, blob: Blob) => Promise<string>;
  html?: MutableRefObject<string>;
};

export default function Panel({ metadata, saveImage }: Props) {
  const { activeTab, set: setLocalStorage } = useLocalStorage();
  const htmlLoaded = useRef(false);

  const [$, setHtml, html, setParentHtml] = useHtml(
    useShallow((state) => [
      state.$,
      state.setHtml,
      state.html,
      state.setParentHtml,
    ]),
  );

  const [active, set, load, meta, saveImgFn] = usePanel(
    useShallow((state) => [
      state.active,
      state.set,
      state.loadMetadata,
      state.metadata,
      state.setSaveImgFn,
    ]),
  );

  const changeTab = (tab: string) => {
    setLocalStorage("activeTab", tab);
    set(tab);
  };

  useEffect(() => {
    if (htmlLoaded.current || !meta || !$) return;

    if (meta?.contentEditables?.length) {
      meta.contentEditables.forEach((selector) => {
        $(selector).attr("contenteditable", "");
      });

      setHtml($);
      htmlLoaded.current = true;
    }
  }, [meta, $, htmlLoaded]);

  useEffect(() => {
    if (!setParentHtml) return;

    if (meta?.contentEditables?.length) {
      const toChange = loadCheerio(html);

      meta?.contentEditables?.forEach((selector) => {
        toChange(selector).removeAttr("contenteditable");
      });

      setParentHtml(toChange.html());
    }
  }, [meta, html]);

  useEffect(() => {
    load(metadata);
  }, [metadata]);

  useEffect(() => {
    saveImage && saveImgFn(saveImage);
  }, []);

  const Acc = useCallback(
    ({ group }: { group: Group }) =>
      group ? (
        <AccordionItem
          key={group.title}
          value={group.title?.toLowerCase()}
          className="px-8"
        >
          <AccordionTrigger className="text-2xl text-[#481453]">
            {group.title}
          </AccordionTrigger>
          <AccordionContent>
            <ItemGenerator element={group} isMain />
          </AccordionContent>
        </AccordionItem>
      ) : null,
    [activeTab, active, meta],
  );

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={activeTab}
      value={active}
      onValueChange={changeTab}
    >
      {(meta?.list?.length ?? 0) > 0 &&
        meta!.list.map((el) =>
          match(el)
            .with({ type: "group" }, (el) => <Acc key={el.title} group={el} />)
            .with({ type: "section" }, (el) => (
              <div className="flex flex-col my-8" key={el.title}>
                <span className="px-8 text-#877997 font-semibold text-xs">
                  {el.title}
                </span>
                {el.type === "section" &&
                  el.elements.map(
                    (el) =>
                      el.type === "group" && <Acc key={el.title} group={el} />,
                  )}
              </div>
            ))
            .otherwise(() => null),
        )}
    </Accordion>
  );
}
