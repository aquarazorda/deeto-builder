import { useHtml } from "@/state/html";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { Item } from "@/state/panel";
import UploadImageDialog from "../dialogs/upload-image";

export default function Images({
  item: { selectors, title, defaultValue },
}: {
  item: Item;
}) {
  const [$, set] = useHtml(
    useShallow((state) => [state.$, state.setHtml, state.styles]),
  );

  const imageUrl = useMemo(
    () => $(selectors[0]).attr("src") ?? defaultValue,
    [$],
  );

  const changeUrl = (src: string) => {
    selectors.forEach((selector) => {
      $(selector).attr("src", src);
    });

    set($);
  };

  return (
    <div className="rounded-2xl border border-[#DDD7E5] bg-white flex flex-col p-4 gap-4">
      <span className="text-base font-medium">{title}</span>
      <div className="rounded-[100px] py-4 px-5 bg-[#DDD7E5] flex justify-center">
        <UploadImageDialog onSave={changeUrl}>
          <img src={imageUrl} width={157} height={53} />
        </UploadImageDialog>
      </div>
      <span className="text-[#877997] text-xs">
        * Image upload size and weight instrucitons
      </span>
    </div>
  );
}
