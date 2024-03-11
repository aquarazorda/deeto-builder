import { useHtml } from "@/state/html";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { Item } from "@/state/panel";
import UploadImageDialog from "../dialogs/upload-image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function Images({
  item: { selectors, title, defaultValue, defaultLink },
}: {
  item: Item;
}) {
  const [$, set] = useHtml(
    useShallow((state) => [state.$, state.setHtml, state.styles]),
  );

  const imageUrl = useMemo(
    () => $?.(selectors[0]).attr("src") ?? defaultValue,
    [$],
  );

  const clickHref = $?.(selectors[0]).parent().attr("href");

  const changeUrl = (src: string) => {
    if (!$) return;
    selectors.forEach((selector) => {
      $(selector).attr("src", src);
    });

    set($);
  };

  const changeHref = (href: string) => {
    if (!$) return;
    selectors.forEach((selector) => {
      $(selector).parent().attr("href", href);
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
      <span className="space-y-2">
        <Label className="text-xs">{title} Url</Label>
        <Input
          value={clickHref}
          placeholder={defaultLink}
          onChange={(e) => changeHref(e.target.value)}
        />
      </span>
    </div>
  );
}
