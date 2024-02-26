import { useHtml } from "@/state/html";
import { Input } from "../ui/input";
import useDebouncedCallback from "@/lib/debounced-callback";
import { useShallow } from "zustand/react/shallow";

const selector = "img[alt='logo']";

export default function LogoSelector() {
  const [$, set] = useHtml(useShallow((state) => [state.$, state.setHtml]));
  const currUrl = $(selector).attr("src");

  const changeUrl = useDebouncedCallback((src: string) => {
    $(selector).attr("src", src);
    set($);
  }, 200);

  return (
    <div>
      {currUrl && "your current url is: " + currUrl}
      {!currUrl && (
        <div>
          No logo found, please write link here{" "}
          <Input
            defaultValue={currUrl}
            onChange={(e) => {
              changeUrl(e.target.value);
            }}
          />{" "}
        </div>
      )}
    </div>
  );
}
