import { Element, Group, Item } from "@/state/panel";
import { match } from "ts-pattern";
import Images from "./images";
import Background from "./background";
import Colors from "./colors";
import { cn } from "@/lib/utils";
import Fonts from "./fonts";
import Text from "./text";
import Form from "./form";
import CssEditor from "./css-editor";
import Shape from "./shape";
import ComponentGroup from "./group";

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
          key={element.title + `${idx}`}
          isMain={false}
        />
      ))}
    </div>
  );
};

const DrawItem = ({ element }: { element: Item }) => {
  console.log(element);
  return match(element)
    .with({ behaviour: "image" }, (el) => <Images item={el} />)
    .with({ behaviour: "background" }, (el) => <Background item={el} />)
    .with({ behaviour: "color" }, (el) => <Colors item={el} />)
    .with({ behaviour: "color-background" }, (el) => (
      <Colors item={el} isBackground />
    ))
    .with({ behaviour: "font" }, (el) => <Fonts item={el} />)
    .with({ behaviour: "text" }, (el) => <Text item={el} />)
    .with({ behaviour: "shape" }, (el) => <Shape item={el} />)
    .with({ behaviour: "component-group" }, (el) => (
      <ComponentGroup item={el} />
    ))
    .with({ behaviour: "css-editor" }, (el) => (
      <CssEditor defaultValue={el.defaultValue} />
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
    .with({ type: "group" }, (element) => (
      <DrawGroup element={element} isMain={isMain} />
    ))
    .with({ type: "form" }, (element) => <Form form={element} />)
    .otherwise(() => "Not yet implemented");
};

export default function ItemGenerator({
  isMain,
  element,
}: {
  element: Element;
  isMain: boolean;
}) {
  return <DrawElement element={element} isMain={isMain} />;
}
