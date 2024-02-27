import { Element, Group, Item, usePanel } from "@/state/panel";
import { match } from "ts-pattern";
import { useShallow } from "zustand/react/shallow";
import Images from "./images";
import Background from "./background";
import Colors from "./colors";
import { cn } from "@/lib/utils";

const DrawGroup = ({
  element,
  isMain,
}: {
  element: Group;
  isMain: boolean;
}) => {
  return (
    <div className={cn("flex flex-col", isMain ? "gap-8" : "gap-2")}>
      {isMain && element.description && (
        <p className="text-[#877997] text-sm">{element.description}</p>
      )}
      {!isMain && element.title && (
        <p className="text-[#2E1334] font-semibold text-xs">{element.title}</p>
      )}
      {element.elements.map((element, idx) => (
        <DrawElement
          element={element}
          key={element.title + idx}
          isMain={false}
        />
      ))}
    </div>
  );
};

const DrawItem = ({ element }: { element: Item }) => {
  return match(element)
    .with({ behaviour: "image" }, (el) => <Images item={el} />)
    .with({ behaviour: "background" }, (el) => <Background item={el} />)
    .with({ behaviour: "color" }, (el) => <Colors item={el} />)
    .with({ behaviour: "color-background" }, (el) => (
      <Colors item={el} isBackground />
    ))
    .otherwise(() => <div>Not implemented - {element.behaviour}</div>);
};

const DrawElement = ({
  element,
  isMain,
}: {
  element: Element;
  isMain: boolean;
}) => {
  return match(element)
    .with({ type: "item" }, (element) => <DrawItem element={element} />)
    .otherwise((element) => <DrawGroup element={element} isMain={isMain} />);
};

export default function ItemGenerator({
  idx,
  isMain,
}: {
  idx: number;
  isMain: boolean;
}) {
  const [element] = usePanel(useShallow((state) => [state.metadata[idx]]));

  return <DrawElement element={element} isMain={isMain} />;
}
