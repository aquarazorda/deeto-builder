import { Metadata, usePanel } from "@/state/panel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useShallow } from "zustand/react/shallow";
import { MutableRefObject, useEffect } from "react";
import ItemGenerator from "./item-generator";
import { useLocalStorage } from "@/lib/local-storage";

type Props = {
  metadata?: Metadata;
  saveImage?: (name: string, blob: Blob) => Promise<string>;
  html?: MutableRefObject<string>;
};

export default function Panel({ metadata, saveImage }: Props) {
  const { activeTab, set: setLocalStorage } = useLocalStorage();
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
    load(metadata);
    saveImage && saveImgFn(saveImage);
  }, []);

  return (
    <div className="bg-secondary rounded-r-xl">
      <Accordion
        type="single"
        collapsible
        defaultValue={activeTab}
        value={active}
        onValueChange={changeTab}
      >
        {meta.length > 0 &&
          meta.map(({ title }, idx) => (
            <AccordionItem
              key={idx}
              value={title.toLowerCase()}
              className="px-2"
            >
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>
                <ItemGenerator idx={idx} isMain />
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}
