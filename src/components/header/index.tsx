import {
  Monitor,
  Paintbrush2,
  Redo,
  TabletSmartphone,
  Undo,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useShallow } from "zustand/react/shallow";
import { useHtml } from "@/state/html";

export default function Header() {
  const [undo, redo, history, idx] = useHtml(
    useShallow((state) => [
      state.undo,
      state.redo,
      state.history,
      state.currentIdx,
    ]),
  );

  return (
    <div className="flex w-full justify-between items-center py-4">
      <span>Hint: Click on the text areas to edit them</span>
      <div className="flex gap-2 h-full">
        <Button variant="outline">
          <TabletSmartphone />
        </Button>
        <Button variant="outline">
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
        <Button>
          <Paintbrush2 /> Edit page
        </Button>
      </div>
    </div>
  );
}
