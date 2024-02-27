import { useHtml } from "@/state/html";
import { Item } from "@/state/panel";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Toggle } from "../ui/toggle";

export default function Background({
  item: { selectors, title },
}: {
  item: Item;
}) {
  const [styles] = useHtml(useShallow((state) => [state.styles]));

  const {
    isImage,
    url: bgUrl,
    color: bgColor,
  } = useMemo(() => {
    const bg = styles?.[selectors[0]]?.background;
    if (bg?.includes("url")) {
      return {
        isImage: true,
        url: bg.match(/url\((.*?)\)/)?.[1].replace(/"/g, ""),
      };
    }

    return {
      isImage: false,
      color: bg,
    };
  }, [styles]);

  return (
    <div className="rounded-2xl border border-[#DDD7E5] bg-white flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">{title}</span>
        <Toggle defaultChecked={isImage}>Image</Toggle>
      </div>

      <div
        className="rounded-[100px] py-4 px-5 flex justify-center"
        onClick={() => {}}
        style={{
          height: "84.33px",
          backgroundColor: !isImage ? bgColor : "#DDD7E5",
        }}
      >
        {isImage && <img src={bgUrl} width={157} height={53} />}
      </div>
      <span className="text-[#877997] text-xs">
        * Image upload size and weight instrucitons
      </span>
    </div>
  );
}
