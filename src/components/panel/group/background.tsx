import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Item } from "@/state/panel";
import ImageIcon from "@/assets/image-icon.svg?react";
import ColorIcon from "@/assets/color-icon.svg?react";

export default function Background({ item }: { item: Item }) {
  return (
    <div>
      <Tabs defaultValue="color">
        <div className="flex justify-between items-center">
          <span>Background</span>
          <TabsList className="bg-[#F0EDF4] rounded-full mb-1">
            <TabsTrigger
              value="image"
              className="data-[state=active]:bg-[#481453] rounded-full"
            >
              <ImageIcon />
            </TabsTrigger>
            <TabsTrigger
              value="color"
              className="data-[state=active]:bg-[#481453] rounded-full"
            >
              <ColorIcon />
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="color">
          <div className="rounded-full h-[70px] bg-[#481453]" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
