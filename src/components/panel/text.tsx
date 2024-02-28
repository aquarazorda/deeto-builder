import { Item } from "@/state/panel";
import { Input } from "../ui/input";
import { useHtml } from "@/state/html";
import { useShallow } from "zustand/react/shallow";
import useDebouncedCallback from "@/lib/debounced-callback";
import { Label } from "../ui/label";

export default function Text({
  item: { title, selectors, defaultValue },
}: {
  item: Item;
}) {
  const [$, set] = useHtml(useShallow((state) => [state.$, state.setHtml]));
  const text = $(selectors[0])?.text() ?? defaultValue;

  // @ts-expect-error this has name, just a type mismatch
  const isAtag = $(selectors[0])?.get(0)?.name === "a";
  const link = isAtag ? $(selectors[0])?.attr("href") : undefined;

  const onChange = useDebouncedCallback((value: string, link?: boolean) => {
    selectors.forEach((selector) => {
      link ? $(selector).attr("href", value) : $(selector).text(value);
    });

    set($);
  }, 400);

  return (
    <div>
      <Label>
        {title}
        {isAtag ? " (Link)" : ""}
      </Label>
      <Input defaultValue={text} onChange={(e) => onChange(e.target.value)} />
      {isAtag && (
        <Input
          defaultValue={link}
          onChange={(e) => onChange(e.target.value, true)}
        />
      )}
    </div>
  );
}
