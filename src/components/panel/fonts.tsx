import { useHtml } from "@/state/html";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

const fonts = [
  { name: "Inter", value: "Inter" },
  { name: "DM Sans", value: "DM Sans" },
];

export default function Fonts() {
  const [styles, swapStyles] = useHtml(
    useShallow((state) => [state.styles, state.swapStyles]),
  );

  const activeFont = useMemo(
    () => styles?.container?.fontFamily?.replace(/"/g, ""),
    [styles],
  );

  return (
    <div className="space-y-2">
      {fonts.map(({ name, value }) => (
        <div
          key={value}
          onClick={() => {
            swapStyles({
              ...styles,
              container: {
                ...styles.container,
                fontFamily: `"${value}"`,
              },
            });
          }}
          className="border rounded-2xl p-4 bg-cover flex justify-between items-center w-full cursor-pointer"
          style={{
            fontFamily: value,
            backgroundImage:
              activeFont === value ? "url('/font-bg.jpg')" : undefined,
          }}
        >
          <span className="text-5xl">Aa</span>
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}
