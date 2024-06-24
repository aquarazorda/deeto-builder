import { cn } from "@/lib/utils";
import { useExtra } from "@/state/extra";
import { Item } from "@/state/panel";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Shape({
  item: { defaultValue, variables, options },
}: {
  item: Item;
}) {
  if (!variables || !options) {
    console.error("Shape widget requires variables");
    return null;
  }

  const [extra, setExtra] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );

  const [active, setActive] = useState(
    extra?.variables &&
      Object.keys(extra.variables).reduce(
        (acc, key) => {
          if (key.startsWith(variables[0])) {
            acc[key.replace(variables[0] + "-", "")] = extra.variables[key];
          }

          return acc;
        },
        {
          ...options?.find(({ behaviour }) => behaviour === defaultValue)
            ?.defaultValue,
        },
      ),
  );

  const onSelect = (value: Record<string, string>) => {
    let newValue = {} as Record<string, string>;

    variables.forEach((variable) => {
      newValue[variable] =
        `${value["tl"]} ${value["tr"]} ${value["br"]} ${value["bl"]}`;

      Object.keys(value).forEach((key) => {
        newValue[variable + "-" + key] = value[key];
      });
    });

    setActive(value);
    setExtra({
      ...extra,
      variables: {
        ...extra.variables,
        ...newValue,
      },
    });
  };

  return (
    <div className="flex w-full justify-between">
      {options.map(({ defaultValue, behaviour, title }) => (
        <div
          key={behaviour}
          className={cn(
            "flex flex-col gap-1 cursor-pointer group",
            JSON.stringify(defaultValue) === JSON.stringify(active) && "active",
          )}
          onClick={() => onSelect(defaultValue)}
        >
          <div
            className="w-[70px] h-[48px] bg-[#C2B7D0] border border-solid border-white group-[.active]:border-4 group-[.active]:bg-[#00C2E9] group-[.active]:border-[#FFC400]"
            style={{
              borderTopRightRadius: defaultValue["top-right"],
              borderTopLeftRadius: defaultValue["top-left"],
              borderBottomRightRadius: defaultValue["bottom-right"],
              borderBottomLeftRadius: defaultValue["bottom-left"],
            }}
          />
          <span className="w-full text-center group-[.active]:font-medium">
            {title}
          </span>
        </div>
      ))}
    </div>
  );
}
