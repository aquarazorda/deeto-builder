import { Item } from "@/state/panel";
import WithAccordion from "./with-accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { useExtra } from "@/state/extra";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useState } from "react";

export default function Border({ item }: { item: Item }) {
  const [colorState, setColorState] = useState<RGBColor>();
  const [extra, set] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );

  const value = useMemo(() => {
    const color = extra.variables?.[item.variables![0] + "-color"] as string;
    const width = extra.variables?.[item.variables![0] + "-width"]?.replace(
      "px",
      "",
    ) as string;

    if (width || color) {
      return {
        width,
        color,
      };
    }

    return item.defaultValue as unknown as { color: string; width: number };
  }, [item, extra.variables]);

  const bgChange = (color: ColorResult) => {
    const rgba = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;

    const newStyles = item.variables?.reduce(
      (acc, key) => {
        acc[key + "-color"] = rgba;
        return acc;
      },
      {} as Record<string, string>,
    );

    setColorState(color.rgb);
    set({
      ...extra,
      variables: {
        ...extra.variables,
        ...newStyles,
      },
    });
  };

  const widthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStyles = item.variables?.reduce(
      (acc, key) => {
        acc[key + "-width"] = e.target.value + "px";
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
      <div className="flex gap-[10px] flex-1 w-full">
        <Popover>
          <PopoverTrigger className="w-2/3">
            <div
              className="rounded-[100px] items-center rounded-tl-none py-4 px-5 flex justify-center cursor-pointer border border-[#DDD7E5]"
              style={{
                height: "66px",
                backgroundColor: value.color,
              }}
            >
              <span
                style={{ mixBlendMode: "difference", filter: "invert(1)" }}
                className="text-base font-semibold"
              >
                Border color
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent style={{ zIndex: 1000 }}>
            <SketchPicker
              onChangeComplete={bgChange}
              color={colorState ?? value.color ?? undefined}
            />
          </PopoverContent>
        </Popover>
        <div className="min-w-0 w-1/3 flex flex-col shadow-input p-4 rounded-2xl">
          <span className="font-medium text-[#877997]">Width</span>
          <input
            className="text-base font-medium text-[#2E1334] w-full"
            value={value.width}
            onChange={widthChange}
          />
        </div>
      </div>
    </WithAccordion>
  );
}
