import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";
import { P, match } from "ts-pattern";

type RowDefaults = {
  key: string;
  value: unknown;
};

type Props<TRow extends RowDefaults> = {
  row: Row<TRow>;
  value?: unknown;
};

export const DrawDynamicInput = <TForm extends FieldValues>({
  value: v,
  field,
  ...props
}: {
  value?: unknown;
  field: ControllerRenderProps<TForm>;
} & Partial<InputProps>) => {
  const value = v === undefined ? field.value : v;

  return useMemo(
    () =>
      match({ type: typeof value, value })
        .with({ type: "boolean", value: P.select(P.boolean) }, () => (
          <div className="flex h-full items-center">
            <Checkbox
              {...field}
              disabled={props.disabled}
              key={field.name}
              checked={value as unknown as boolean}
              onCheckedChange={field.onChange}
            />
          </div>
        ))
        .with({ type: "string", value: P.select(P.string) }, (value) => {
          return value.length > 100 ? (
            <Textarea key={field.name} {...field} />
          ) : (
            <Input
              {...field}
              {...props}
              key={field.name}
              type={typeof value === "number" ? "number" : "text"}
            />
          );
        })
        .otherwise(() => JSON.stringify(value)),
    [value, field],
  );
};

export default function DynamicFieldInput<
  TForm extends FieldValues,
  TRow extends RowDefaults,
>({ row, value }: Props<TRow>) {
  const form = useFormContext<TForm>();

  return (
    <div className="flex gap-2 w-full justify-end">
      <FormField
        control={form.control}
        name={row.original.key as Path<TForm>}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <DrawDynamicInput value={value as string} field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
