import { Item } from "@/state/panel";
import WithAccordion from "./with-accordion";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useExtra } from "@/state/extra";
import { useShallow } from "zustand/react/shallow";
import useDebouncedCallback from "@/lib/debounced-callback";
import {
  CSSProperties,
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  useMemo,
} from "react";

const RadiusIcon = ({ style }: { style: CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={style}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0H10.6154C11.3801 0 12 0.619913 12 1.38462C12 2.14932 11.3801 2.76923 10.6154 2.76923H2.76923V10.6154C2.76923 11.3801 2.14932 12 1.38462 12C0.619913 12 0 11.3801 0 10.6154V0Z"
      fill="#DDD7E5"
    />
  </svg>
);

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { rotate?: number }
>(({ rotate, ...props }, ref) => {
  return (
    <FormControl>
      <div className="min-w-0 max-w-fit relative flex flex-1 shadow-input p-4 rounded-2xl items-center gap-4">
        <div className="flex-1">
          <RadiusIcon
            style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
          />
        </div>
        <input
          ref={ref}
          className="text-base font-medium text-[#2E1334] w-full"
          type="number"
          {...props}
        />
      </div>
    </FormControl>
  );
});

export default function CornerRadius({ item }: { item: Item }) {
  const [extra, set] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );

  const debouncedSet = useDebouncedCallback(set, 400);

  const defaultValues = useMemo(() => {
    const str = extra.variables?.[item.variables![0]] ?? item.defaultValue;
    const values = str.replace(/px/g, "").split(" ");

    if (item.extra?.split) {
      const tl = extra.variables?.[item.variables![0] + "-tl"] ?? values[0];
      const tr = extra.variables?.[item.variables![0] + "-tr"] ?? values[1];
      const br = extra.variables?.[item.variables![0] + "-br"] ?? values[2];
      const bl = extra.variables?.[item.variables![0] + "-bl"] ?? values[3];

      return {
        topLeft: tl?.replace("px", "") as string,
        topRight: tr?.replace("px", "") as string,
        bottomRight: br?.replace("px", "") as string,
        bottomLeft: bl?.replace("px", "") as string,
      };
    }

    return {
      topLeft: values[0] as string,
      topRight: values[1] as string,
      bottomRight: values[2] as string,
      bottomLeft: values[3] as string,
    };
  }, []);

  const form = useForm({
    defaultValues,
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      const value = `${values.topLeft}px ${values.topRight}px ${values.bottomRight}px ${values.bottomLeft}px`;

      const toSave = item.variables?.reduce(
        (acc, variable) => {
          if (item.extra?.split) {
            acc[variable + "-tl"] = values.topLeft + "px";
            acc[variable + "-tr"] = values.topRight + "px";
            acc[variable + "-br"] = values.bottomRight + "px";
            acc[variable + "-bl"] = values.bottomLeft + "px";
            return acc;
          }

          acc[variable] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      debouncedSet({
        ...extra,
        variables: {
          ...extra.variables,
          ...toSave,
        },
      });
    });

    return unsubscribe;
  }, [extra]);

  return (
    <WithAccordion item={item}>
      <Form {...form}>
        <div className="flex gap-2 flex-1">
          <FormField
            name="topLeft"
            render={({ field }) => <Input {...field} />}
          />
          <FormField
            name="topRight"
            render={({ field }) => <Input {...field} rotate={90} />}
          />
        </div>
        <div className="flex flex-1 gap-2">
          <FormField
            name="bottomLeft"
            render={({ field }) => <Input {...field} rotate={270} />}
          />
          <FormField
            name="bottomRight"
            render={({ field }) => <Input {...field} rotate={180} />}
          />
        </div>
      </Form>
    </WithAccordion>
  );
}
