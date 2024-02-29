import { useHtml } from "@/state/html";
import { Item } from "@/state/panel";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ROOT_URL } from "@/config";

export default function Fonts({
  item: { title, defaultValue, selectors },
}: {
  item: Item;
}) {
  const [styles, swapStyles] = useHtml(
    useShallow((state) => [state.styles, state.swapStyles]),
  );

  const activeFont = useMemo(
    () => styles?.[selectors[0]]?.fontFamily?.replace(/"/g, ""),
    [styles],
  );

  return (
    <div className="space-y-2">
      <div
        key={title}
        onClick={() => {
          swapStyles({
            ...styles,
            container: {
              ...styles.container,
              fontFamily: `"${defaultValue}"`,
            },
          });
        }}
        className="border rounded-2xl p-4 bg-cover flex justify-between items-center w-full cursor-pointer"
        style={{
          fontFamily: defaultValue,
          backgroundImage:
            activeFont === defaultValue
              ? `url('${ROOT_URL}/images/font-bg.jpg')`
              : undefined,
        }}
      >
        <span className="text-5xl">Aa</span>
        <span>{title}</span>
      </div>
    </div>
  );
}
