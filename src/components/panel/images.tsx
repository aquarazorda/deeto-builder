import { useHtml } from "@/state/html";
import { Input } from "../ui/input";
import useDebouncedCallback from "@/lib/debounced-callback";
import { useShallow } from "zustand/react/shallow";
import { Toggle } from "../ui/toggle";
import { useMemo } from "react";

const selector = "img[alt='logo']";

export default function Images() {
  const [$, set, styles] = useHtml(
    useShallow((state) => [state.$, state.setHtml, state.styles]),
  );

  const logoUrl = useMemo(() => $(selector).attr("src"), [$]);

  const {
    isImage,
    url: bgUrl,
    color: bgColor,
  } = useMemo(() => {
    const bg = styles?.container?.background;
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

  const changeUrl = useDebouncedCallback((src: string) => {
    $(selector).attr("src", src);
    set($);
  }, 200);

  return (
    <div>
      <div className="flex flex-col gap-8">
        <div className="rounded-2xl border border-[#DDD7E5] bg-white flex flex-col p-4 gap-4">
          <span className="text-base font-medium">Logo</span>
          <div className="rounded-[100px] py-4 px-5 bg-[#DDD7E5] flex justify-center">
            <img src={logoUrl} width={157} height={53} />
          </div>
          <span className="text-[#877997] text-xs">
            * Image upload size and weight instrucitons
          </span>
        </div>
        <div className="rounded-2xl border border-[#DDD7E5] bg-white flex flex-col p-4 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Page background</span>
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
      </div>
    </div>
  );
}
