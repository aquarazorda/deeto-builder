import { Element, Group, Item, usePanel } from "@/state/panel";
import { match } from "ts-pattern";
import { useShallow } from "zustand/react/shallow";
import Images from "./images";
import Background from "./background";
import Colors from "./colors";

const DrawGroup = ({
  element,
  isMain,
}: {
  element: Group;
  isMain: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {isMain && element.description && (
        <p className="text-[#877997] mb-10 text-sm">{element.description}</p>
      )}
      {!isMain && element.title && (
        <p className="text-[#2E1334] font-semibold text-xs">{element.title}</p>
      )}
      {element.elements.map((element, idx) => (
        <DrawElement
          element={element}
          key={element.title + idx}
          isMain={isMain}
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

export default function ItemGenerator({ idx }: { idx: number }) {
  const [element] = usePanel(useShallow((state) => [state.metadata[idx]]));

  return <DrawElement element={element} isMain />;
}
