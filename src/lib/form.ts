import { useState, useEffect, useMemo } from "react";
import { match } from "ts-pattern";
import { ZodSchema, z, ZodTypeAny } from "zod";

export const useDynamicFormData = <T extends Record<string, unknown>>(
  origData?: T,
) => {
  const [state, setState] = useState<{
    schema?: ZodSchema<T>;
    data: { key: keyof T; value: T[keyof T] }[];
    defaultValues?: T;
  }>({
    data: [],
  });

  useEffect(() => {
    if (!origData) return;

    const { data, schemaArr, defaultValues } = Object.keys(origData).reduce(
      (acc, k) => {
        const key = k as unknown as string;
        const value = origData[key] as T[keyof T];

        if (
          value === null ||
          value === undefined ||
          typeof value === "object" ||
          // @ts-expect-error it might be an array
          (typeof value !== "string" && !!value.length)
        ) {
          return acc;
        }

        acc.data.push({
          key,
          value,
        });

        // @ts-expect-error we're doing a type check above
        acc.defaultValues[key] = value;

        acc.schemaArr.push({
          key,
          fieldType: match(typeof value)
            .with("string", () => z.string().min(3))
            .with("number", () => z.number())
            .with("boolean", () => z.boolean())
            .otherwise(() => z.any()),
        });

        return acc;
      },
      {
        data: [],
        schemaArr: [],
        defaultValues: {} as T,
      } as {
        data: { key: keyof T; value: T[keyof T] }[];
        schemaArr: { key: string; fieldType: ZodTypeAny }[];
        defaultValues: T;
      },
    );

    setState({
      data,
      schema: z.object(
        Object.fromEntries(schemaArr.map((s) => [s.key, s.fieldType])),
      ) as unknown as ZodSchema<T>,
      defaultValues,
    });
  }, [origData]);

  const returnValue = useMemo(
    () => ({
      data: state.data,
      schema: state.schema,
      defaultValues: state.defaultValues,
    }),
    [state],
  );

  return returnValue;
};
