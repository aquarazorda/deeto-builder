import useDebouncedCallback from "@/lib/debounced-callback";
import { useHtml } from "@/state/html";
import { useEffect, useRef, useState } from "react";
// @ts-expect-error there are no types for react-style-editor
import StyleEditor from "react-style-editor";
import { useShallow } from "zustand/react/shallow";

type Props = {
  defaultValue: string;
};

export default function CssEditor({ defaultValue }: Props) {
  const [html, $, setHtml] = useHtml(
    useShallow((state) => [state.html, state.$, state.setHtml]),
  );
  const changed = useRef(false);
  const [value, setValue] = useState(defaultValue ?? "");

  const onChange = useDebouncedCallback((value: string) => {
    if (!$) return;
    if (!changed.current) changed.current = true;
    console.log(value);

    $("style").each((i, el) => {
      if (i === 1) {
        $(el).text(value);
      }
    });

    setHtml($);
  }, 200);

  useEffect(() => {
    if (!$) return;

    $("style").each((i, el) => {
      if (i === 1) {
        if (!changed.current) {
          setValue(defaultValue ?? "");
          return;
        }

        setValue($(el).text());
      }
    });
  }, [html, $]);

  return (
    <StyleEditor
      defaultValue={defaultValue ?? ""}
      value={value}
      onChange={onChange}
    />
  );
}
