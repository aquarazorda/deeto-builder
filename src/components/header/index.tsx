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
  const [undo, redo, history, idx, save] = useHtml(
    useShallow((state) => [
      state.undo,
      state.redo,
      state.history,
      state.currentIdx,
      state.save,
    ]),
  );

  return (
    <div className="flex w-full justify-between items-center py-4">
      <span className="font-medium text-lg">Deeto Template Editor</span>
      <div className="flex gap-2 h-full">
        <Button variant="outline" disabled>
          <TabletSmartphone />
        </Button>
        <Button variant="outline" disabled>
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
        <Button
          disabled={history.length < 2 || idx === 0}
          onClick={save}
          className="space-x-2"
        >
          <Paintbrush2 /> <span>Save changes</span>
        </Button>
      </div>
    </div>
  );
}
