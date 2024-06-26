import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Item } from "@/state/panel";
import ImageIcon from "@/assets/image-icon.svg?react";
import ColorIcon from "@/assets/color-icon.svg?react";
import { useExtra } from "@/state/extra";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorResult, RGBColor, SketchPicker } from "react-color";

export default function Background({ item }: { item: Item }) {
  const [colorState, setColorState] = useState<RGBColor>();
  const [set, extra] = useExtra(
    useShallow((state) => [state.set, state.state]),
  );

  const value = useMemo(
    () => extra.variables?.[item.variables![0]] ?? item.defaultValue,
    [extra.variables, item],
  );

  const onChange = (color: ColorResult) => {
    const rgba = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    const newStyles = item.variables?.reduce(
      (acc, key) => {
        acc[key] = rgba;
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

  return (
    <div className="pb-5">
      <Tabs defaultValue="color">
        <div className="flex justify-between items-center">
          <span>Background</span>
          <TabsList className="bg-[#F0EDF4] rounded-full mb-1">
            <TabsTrigger
              value="image"
              className="data-[state=active]:bg-[#481453] rounded-full"
            >
              <ImageIcon />
            </TabsTrigger>
            <TabsTrigger
              value="color"
              className="data-[state=active]:bg-[#481453] rounded-full"
            >
              <ColorIcon />
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="color">
          <Popover>
            <PopoverTrigger className="h-fit-content w-full">
              <div
                className="rounded-full border border-[#DDD7E5] h-[70px]"
                style={{ backgroundColor: value }}
              />
            </PopoverTrigger>
            <PopoverContent style={{ zIndex: 1000 }}>
              <SketchPicker
                onChangeComplete={onChange}
                color={colorState ?? value}
              />
            </PopoverContent>
          </Popover>
        </TabsContent>
      </Tabs>
    </div>
  );
}
