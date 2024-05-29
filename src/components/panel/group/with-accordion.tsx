import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Item } from "@/state/panel";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ReactNode, useState } from "react";

export default function WithAccordion({
  item,
  children,
}: {
  item: Item;
  children: ReactNode;
}) {
  const [value, setValue] = useState("");

  return (
    <Accordion type="single" value={value}>
      <AccordionItem value={item.title} className="border-none">
        <div className="flex justify-between mb-2">
          {item.title}
          {value ? (
            <MinusIcon
              className="cursor-pointer"
              onClick={() => setValue("")}
            />
          ) : (
            <PlusIcon
              className="cursor-pointer"
              onClick={() => setValue(item.title)}
            />
          )}
        </div>
        <AccordionContent className="flex flex-col gap-2">
          {children}{" "}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
