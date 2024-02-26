import { useHtml } from "@/state/html";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";
import useDebouncedCallback from "@/lib/debounced-callback";

const selector = "img[alt='logo']";

export default function LogoSelector() {
  const $ = useHtml((state) => state.$);
  const ref = useRef(null);
  const currUrl = $(selector).attr("src");

  const changeUrl = useDebouncedCallback((src: string) => {
    $(selector).attr("src", src);
  }, 200);

  return (
    <div>
      {currUrl && "your current url is: " + currUrl}
      {!currUrl && (
        <div>
          "No logo found, please write link here - "{" "}
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
