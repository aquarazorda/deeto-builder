import { Input } from "@/components/ui/input";
import { Item } from "@/state/panel";
import WithAccordion from "./with-accordiont";

const inputClassName =
  "focus-visible:ring-0 shadow-input h-[38px] rounded-2xl border border-[#F0EDF4]";

export default function CornerRadius({ item }: { item: Item }) {
  return (
    <WithAccordion item={item}>
      <div className="flex gap-2">
        <Input className={inputClassName} />
        <Input className={inputClassName} />
      </div>
      <div className="flex gap-2">
        <Input className={inputClassName} />
        <Input className={inputClassName} />
      </div>
    </WithAccordion>
  );
}
