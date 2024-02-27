import { usePanel } from "@/state/panel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import ItemGenerator from "./item-generator";
import { useLocalStorage } from "@/lib/local-storage";

export default function Panel() {
  const { activeTab, set: setLocalStorage } = useLocalStorage();
  const [active, set, load, metadata] = usePanel(
    useShallow((state) => [
      state.active,
      state.set,
      state.loadMetadata,
      state.metadata,
    ]),
  );

  const changeTab = (tab: string) => {
    setLocalStorage("activeTab", tab);
    set(tab);
  };

  useEffect(() => {
    load();
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
        {metadata.length > 0 &&
          metadata.map(({ title }, idx) => (
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
