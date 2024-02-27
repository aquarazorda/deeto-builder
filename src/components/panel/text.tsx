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

  const onChange = useDebouncedCallback((value: string) => {
    selectors.forEach((selector) => {
      $(selector).text(value);
    });

    set($);
  }, 400);

  return (
    <div>
      <Label>{title}</Label>
      <Input defaultValue={text} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
