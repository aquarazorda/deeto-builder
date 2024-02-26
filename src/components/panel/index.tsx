import { usePanel } from "@/state/panel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Images from "./images";
import { useShallow } from "zustand/react/shallow";
import Fonts from "./fonts";

export default function Panel() {
  const [active, set] = usePanel(
    useShallow((state) => [state.active, state.set]),
  );

  return (
    <div className="bg-secondary rounded-r-xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="logo"
        value={active}
        onValueChange={set}
      >
        <AccordionItem value="logo" className="px-2">
          <AccordionTrigger>Images</AccordionTrigger>
          <AccordionContent>
            <Images />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fonts" className="px-2">
          <AccordionTrigger>Fonts</AccordionTrigger>
          <AccordionContent>
            <Fonts />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="color" className="px-2">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>Test</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
