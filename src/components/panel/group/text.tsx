import { Item } from "@/state/panel";
import WithAccordion from "./with-accordion";
import { useExtra } from "@/state/extra";
import { useMemo } from "react";

export default function GroupText({ item }: { item: Item }) {
  if (!item.variables) {
    throw new Error("No variables provided");
  }

  const [extra, set] = useExtra((state) => [state.state, state.set]);

  const value = useMemo(
    () => extra[item.variables![0]] ?? item.defaultValue,
    [extra, item.defaultValue],
  );

  const onChange = (value: string) => {
    const newValues = item.variables!.reduce(
      (acc, key) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    set({
      ...extra,
      ...newValues,
    });
  };

  return (
    <WithAccordion item={item}>
      <div className="min-w-0 flex flex-col flex-1 shadow-input p-4 rounded-2xl">
        <span className="font-medium text-[#877997]">{item.extra?.label}</span>
        <input
          className="text-base font-medium text-[#2E1334] w-fit"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </WithAccordion>
  );
}
