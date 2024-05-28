import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useExtra } from "@/state/extra";
import { Item } from "@/state/panel";
import { InputHTMLAttributes, forwardRef, useEffect, useMemo } from "react";
import { RGBColor, SketchPicker } from "react-color";
import { useForm } from "react-hook-form";
import WithAccordion from "./with-accordiont";
import { useShallow } from "zustand/react/shallow";
import useDebouncedCallback from "@/lib/debounced-callback";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { title: string }
>(({ title, ...props }, ref) => {
  return (
    <FormControl>
      <div className="min-w-0 flex flex-col flex-1 shadow-input p-4 rounded-2xl">
        <span className="font-medium text-[#877997]">{title}</span>
        <input
          ref={ref}
          className="text-base font-medium text-[#2E1334] w-fit"
          {...props}
        />
      </div>
    </FormControl>
  );
});

export default function Shadow({ item }: { item: Item }) {
  if (!item.variables) {
    throw new Error("Variables not found");
  }

  const [set, state] = useExtra(
    useShallow((state) => [state.set, state.state]),
  );

  const debouncedSet = useDebouncedCallback(set, 400);

  const defaultValues = useMemo(() => {
    const val = (state.variables?.[item.variables![0]] ??
      item.defaultValue) as string;
    const values = val.replace(/px/g, "").split(" ");
    const rgbaArray = values[4].match(
      /rgba?\((\d+),(\d+),(\d+),?(\d*\.?\d+)?\)/,
    );

    if (rgbaArray) {
      const color = {
        r: parseInt(rgbaArray[1], 10),
        g: parseInt(rgbaArray[2], 10),
        b: parseInt(rgbaArray[3], 10),
        a: parseFloat(rgbaArray[4]),
      } satisfies RGBColor;

      return {
        xOffset: parseInt(values[0]),
        yOffset: parseInt(values[1]),
        blurRadius: parseInt(values[2]),
        spreadRadius: parseInt(values[3]),
        color,
      };
    }

    return {
      xOffset: 0,
      yOffset: 0,
      blurRadius: 0,
      spreadRadius: 0,
      color: {} as RGBColor,
    };
  }, []);

  const form = useForm({
    defaultValues,
  });

  const toString = (color: Partial<RGBColor>) => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  };

  useEffect(() => {
    const { unsubscribe } = form.watch(
      ({ xOffset, yOffset, blurRadius, spreadRadius, color }) => {
        const value = `${xOffset}px ${yOffset}px ${blurRadius}px ${spreadRadius}px ${
          color ? toString(color) : defaultValues.color
        }`;

        const values = item.variables?.reduce(
          (acc, variable: string) => {
            acc[variable] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        debouncedSet({
          ...state,
          variables: {
            ...state.variables,
            ...values,
          },
        });
      },
    );

    return unsubscribe;
  }, []);

  return (
    <WithAccordion item={item}>
      <Form {...form}>
        <div className="flex gap-2">
          <FormField
            name="xOffset"
            control={form.control}
            render={({ field }) => (
              <Input title="X offset" {...field} type="number" />
            )}
          />
          <FormField
            name="yOffset"
            control={form.control}
            render={({ field }) => (
              <Input title="Y offset" {...field} type="number" />
            )}
          />
        </div>
        <div className="flex gap-2 w-full">
          <FormField
            name="blurRadius"
            control={form.control}
            render={({ field }) => (
              <Input title="Blur" {...field} type="number" />
            )}
          />
          <FormField
            name="spreadRadius"
            control={form.control}
            render={({ field }) => (
              <Input title="Spread" {...field} type="number" />
            )}
          />
        </div>
        <FormField
          name="color"
          control={form.control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger>
                <div
                  className="rounded-2xl rounded-tl-none items-center p-4"
                  style={{ backgroundColor: toString(field.value) ?? "black" }}
                >
                  <span
                    style={{ mixBlendMode: "difference", filter: "invert(1)" }}
                    className="text-base font-semibold"
                  >
                    Shadow color
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent style={{ zIndex: 1000 }}>
                <SketchPicker
                  color={field.value}
                  onChangeComplete={(color) => {
                    field.onChange(color.rgb);
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </Form>
    </WithAccordion>
  );
}
