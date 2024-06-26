import { useHtml } from "@/state/html";
import { Item } from "@/state/panel";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Toggle } from "../ui/toggle";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import useDebouncedCallback from "@/lib/debounced-callback";
import UploadImageDialog from "../dialogs/upload-image";
import LoadingSpinner from "../ui/loading-spinner";

export default function Background({
  item: { selectors, title, defaultValue },
}: {
  item: Item;
}) {
  const [colorState, setColorState] = useState<RGBColor>();
  const [mode, setMode] = useState("color");
  const [styles, swap] = useHtml(
    useShallow((state) => [state.styles, state.swapStyles]),
  );

  const bgChange = useDebouncedCallback((color: ColorResult) => {
    const rgba = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    const newStyles = { ...styles };

    selectors?.forEach((selector) => {
      newStyles[selector].background = rgba;
    });

    setColorState(color.rgb);
    swap(newStyles);
  }, 200);

  const bgChangeImage = (url: string) => {
    const newStyles = { ...styles };

    selectors?.forEach((selector) => {
      styles[selector].background = `url(${url})`;
      styles[selector].backgroundSize = `100% 100%`;
      styles[selector].backgroundRepeat = `no-repeat`;
    });

    swap(newStyles);
  };

  const {
    isImage,
    url: bgUrl,
    color: bgColor,
  } = useMemo(() => {
    const bg = selectors?.[0] && styles?.[selectors[0]]?.background;

    if (bg?.includes("url")) {
      return {
        isImage: true,
        url: bg.match(/url\((.*?)\)/)?.[1].replace(/"/g, ""),
      };
    }

    const rgbRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

    return {
      isImage: false,
      color: bg?.startsWith("#")
        ? bg
        : bg?.match(rgbRegex)?.[0] ?? defaultValue,
    };
  }, [styles]);

  useEffect(() => {
    setMode(isImage ? "image" : "color");
  }, [isImage]);

  return (
    <div className="rounded-2xl border border-[#DDD7E5] bg-white flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">{title}</span>
        <Toggle
          defaultChecked={isImage}
          onPressedChange={(pressed) => setMode(pressed ? "image" : "color")}
        >
          Image
        </Toggle>
      </div>

      {mode === "color" ? (
        <Popover>
          <PopoverTrigger>
            <div
              className="rounded-[100px] py-4 px-5 flex justify-center cursor-pointer"
              style={{
                height: "84.33px",
                backgroundColor: bgColor ?? defaultValue,
              }}
            />
          </PopoverTrigger>
          <PopoverContent style={{ zIndex: 1000 }}>
            <SketchPicker
              onChangeComplete={bgChange}
              color={colorState ?? bgColor}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <div
          className="rounded-[100px] py-4 px-5 flex justify-center cursor-pointer"
          style={{
            backgroundColor: "#DDD7E5",
          }}
        >
          <UploadImageDialog onSave={bgChangeImage}>
            <img src={bgUrl} width={157} height={53} />
          </UploadImageDialog>
        </div>
      )}
      <span className="text-[#877997] text-xs">
        * Image upload size and weight instructions
      </span>
    </div>
  );
}
