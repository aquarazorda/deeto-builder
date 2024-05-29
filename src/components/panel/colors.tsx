import { Item } from "@/state/panel";
import { useHtml } from "@/state/html";
import { useShallow } from "zustand/react/shallow";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ColorResult, SketchPicker } from "react-color";
import useDebouncedCallback from "@/lib/debounced-callback";
import { useExtra } from "@/state/extra";

export default function Colors({
  item: { title, selectors, defaultValue, variables },
  isBackground,
}: {
  item: Item;
  isBackground?: boolean;
}) {
  const [styles, swap] = useHtml(
    useShallow((state) => [state.styles, state.swapStyles]),
  );

  const [extras, setExtras] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );

  const selector = isBackground ? "background" : "color";
  const isVariable = variables?.length ?? 0 > 0;
  const color =
    (isVariable
      ? extras?.variables?.[variables![0]]
      : styles?.[selectors![0]]?.[selector]) ?? defaultValue;

  const changeColor = useDebouncedCallback((color: ColorResult) => {
    const newStyles = { ...styles };

    if (isVariable) {
      let newExtras = { ...extras };
      variables!.forEach((variable) => {
        newExtras.variables[variable] = color.hex;
      });

      setExtras(newExtras);
      return;
    }

    selectors?.forEach((itemSelector) => {
      const el = newStyles[itemSelector];
      if (el) el[selector] = color.hex;
      else newStyles[itemSelector] = { color: color.hex };
    });

    swap(newStyles);
  }, 200);

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="w-full p-4 border rounded-2xl cursor-pointer text-start"
          style={{ backgroundColor: color }}
        >
          <span
            className="text-base font-semibold"
            style={{ mixBlendMode: "difference", filter: "invert(1)" }}
          >
            {title}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent style={{ zIndex: 1000 }}>
        <SketchPicker color={color} onChangeComplete={changeColor} />
      </PopoverContent>
    </Popover>
  );
}
