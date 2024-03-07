import { useHtml } from "@/state/html";
import { Item } from "@/state/panel";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ROOT_URL } from "@/config";
import { cn } from "@/lib/utils";

export default function Fonts({
  item: { title, defaultValue, selectors, link },
}: {
  item: Item;
}) {
  const [styles, swapStyles, $, setHtml] = useHtml(
    useShallow((state) => [
      state.styles,
      state.swapStyles,
      state.$,
      state.setHtml,
    ]),
  );

  const activeFont = useMemo(
    () => styles?.[selectors[0]]?.fontFamily?.replace(/"/g, ""),
    [styles],
  );

  const isActive = useMemo(() => activeFont === defaultValue, [activeFont]);

  const onClick = () => {
    if (!$) return;

    $("head")
      .children("link")
      .each((_, el) => {
        el.attribs.href.includes("css2?family") && $(el).attr("href", link);
      });

    setHtml($);

    swapStyles({
      ...styles,
      container: {
        ...styles.container,
        fontFamily: `"${defaultValue}"`,
      },
    });
  };

  useEffect(() => {
    if (defaultValue === "Inter") return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${defaultValue.replace(
      / /g,
      "+",
    )}:wght@700&display=swap&text=Aa`;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="space-y-2">
      <div
        key={title}
        onClick={onClick}
        className={cn(
          "border rounded-2xl p-4 bg-cover flex justify-between items-center w-full cursor-pointer",
          isActive ? "text-white" : "text-[#2E1334]",
        )}
        style={{
          backgroundImage: isActive
            ? `url('${ROOT_URL}/images/font-bg.jpg')`
            : undefined,
        }}
      >
        <span className="text-5xl" style={{ fontFamily: defaultValue }}>
          Aa
        </span>
        <span className="italic">{title}</span>
      </div>
    </div>
  );
}
