import { Monitor, Redo, TabletSmartphone, Undo } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useShallow } from "zustand/react/shallow";
import { useHtml } from "@/state/html";
import { useLocalStorage } from "@/lib/local-storage";
import { useEffect, useState } from "react";

export default function Header() {
  const { set, mobileMode } = useLocalStorage();
  const [state, setState] = useState(mobileMode);

  const onChange = (mobileMode: boolean) => {
    setState(mobileMode);
    set("mobileMode", mobileMode);
  };

  const [undo, redo, history, idx] = useHtml(
    useShallow((state) => [
      state.undo,
      state.redo,
      state.history,
      state.currentIdx,
      state.save,
    ]),
  );

  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      if (history.length) {
        event.preventDefault();
        // @ts-expect-error needed for older browsers
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [history]);

  return (
    <div className="flex w-full justify-between items-center py-4 px-6">
      <span className="font-medium text-lg">Deeto Template Editor</span>
      <div className="flex gap-2 h-full">
        <Button
          variant="outline"
          disabled={state}
          onClick={() => onChange(true)}
        >
          <TabletSmartphone />
        </Button>
        <Button
          variant="outline"
          disabled={!state}
          onClick={() => onChange(false)}
        >
          <Monitor />
        </Button>
        <Separator orientation="vertical" className="h-auto" />
        <Button
          variant="outline"
          disabled={!history.length || idx === 0}
          onClick={undo}
        >
          <Undo />
        </Button>
        <Button
          variant="outline"
          disabled={history.length - idx === 1}
          onClick={redo}
        >
          <Redo />
        </Button>
        {/* <Button */}
        {/*   disabled={history.length < 2 || idx === 0} */}
        {/*   onClick={save} */}
        {/*   className="space-x-2" */}
        {/* > */}
        {/*   <Paintbrush2 /> <span>Save changes</span> */}
        {/* </Button> */}
      </div>
    </div>
  );
}
