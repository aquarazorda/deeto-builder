import {
  Monitor,
  Paintbrush2,
  Redo,
  TabletSmartphone,
  Undo,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Header() {
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
        <Button variant="outline">
          <Undo />
        </Button>
        <Button variant="outline">
          <Redo />
        </Button>
        <Button>
          <Paintbrush2 /> Edit page
        </Button>
      </div>
    </div>
  );
}
