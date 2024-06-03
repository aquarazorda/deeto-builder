import { Item } from "@/state/panel";
import Background from "./background";
import { match } from "ts-pattern";
import CornerRadius from "./corner-radius";
import Shadow from "./shadow";
import GroupImage from "./image";
import Border from "./border";
import GroupText from "./text";
import GroupColor from "./color";

const getContent = (item: any) => {
  return match(item.type)
    .with("background", () => <Background item={item} />)
    .with("corner-radius", () => <CornerRadius item={item} />)
    .with("shadow", () => <Shadow item={item} />)
    .with("image", () => <GroupImage item={item} />)
    .with("border", () => <Border item={item} />)
    .with("color", () => <GroupColor item={item} />)
    .with("text", () => <GroupText item={item} />)
    .otherwise(() => null);
};

export default function ComponentGroup({ item }: { item: Item }) {
  return (
    <div className="flex flex-col max-w-full bg-white rounded-2xl p-4 divide-y divide-[#DDD7E5]">
      <span className="font-bold text-[#51425E] font-inter mb-4">
        {item.title}
      </span>
      <>
        {item.options?.map(
          (option) =>
            getContent(option) && (
              <div className="pt-2 max-w-full" key={option.type}>
                {getContent(option)}
              </div>
            ),
        )}
      </>
    </div>
  );
}
