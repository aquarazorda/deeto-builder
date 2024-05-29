import { Item } from "@/state/panel";
import WithAccordion from "./with-accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorResult, SketchPicker } from "react-color";
import { useExtra } from "@/state/extra";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

export default function GroupColor({ item }: { item: Item }) {
  const [extra, set] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );

  const value = useMemo(() => {
    const color = extra.variables?.[item.variables![0]] as string;
    if (color) {
      return color;
    }
    return item.defaultValue;
  }, [extra.variables, item]);

  const onChange = (color: ColorResult) => {
    const newStyles = item.variables?.reduce(
      (acc, key) => {
        acc[key] = color.hex;
        return acc;
      },
      {} as Record<string, string>,
    );

    set({
      ...extra,
      variables: {
        ...extra.variables,
        ...newStyles,
      },
    });
  };

  return (
    <WithAccordion item={item}>
      <Popover>
        <PopoverTrigger>
          <div
            className="rounded-2xl rounded-tl-none items-center p-4"
            style={{ backgroundColor: value ?? "black" }}
          >
            <span
              style={{ mixBlendMode: "difference", filter: "invert(1)" }}
              className="text-base font-semibold"
            >
              {item.extra?.label}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent style={{ zIndex: 1000 }}>
          <SketchPicker color={value} onChangeComplete={onChange} />
        </PopoverContent>
      </Popover>
    </WithAccordion>
  );
}
