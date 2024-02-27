import { Element, Group, Item, usePanel } from "@/state/panel";
import { match } from "ts-pattern";
import { useShallow } from "zustand/react/shallow";
import Images from "./images";
import Background from "./background";

const DrawGroup = ({ element }: { element: Group }) => {
  return (
    <div className="flex flex-col gap-8">
      {element.elements.map((element, idx) => (
        <DrawElement element={element} key={element.title + idx} />
      ))}
    </div>
  );
};

const DrawItem = ({ element }: { element: Item }) => {
  return match(element)
    .with({ behaviour: "image" }, (el) => <Images item={el} />)
    .with({ behaviour: "background" }, (el) => <Background item={el} />)
    .otherwise(() => <div>Not implemented - {element.behaviour}</div>);
};

const DrawElement = ({ element }: { element: Element }) => {
  return match(element)
    .with({ type: "item" }, (element) => <DrawItem element={element} />)
    .otherwise((element) => <DrawGroup element={element} />);
};

export default function ItemGenerator({ idx }: { idx: number }) {
  const [element] = usePanel(useShallow((state) => [state.metadata[idx]]));

  return <DrawElement element={element} />;
}
