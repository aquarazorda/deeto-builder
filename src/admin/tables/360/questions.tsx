import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useGetVendorDetails, {
  VendorDetailsResponse,
} from "@/queries/useGetVendorDetails";
import { useAdminState } from "@/state/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import {
  CustomizedFormField,
  fieldRepresentation,
  fieldType,
  viewModeIcons,
} from "@/admin/types/customized-form-values";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalize } from "@/lib/utils";
import { useForm, useFormContext } from "react-hook-form";
import { RowDragHandleCell } from "@/components/dnd/table-drag-cell";
import { Input } from "@/components/ui/input";
import { useApi } from "@/state/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useDebouncedCallback from "@/lib/debounced-callback";
import useUpdateQaQuestionMutation from "@/queries/useUpdateQaQuestionMutation";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  customizedFormFieldId: z.string(),
  fieldLabel: z.string(),
  fieldType: z.enum(fieldType),
  fieldRepresentation: z.enum(fieldRepresentation),
  appearanceOrder: z.number(),
  viewModeLabel: z.coerce.string().optional(),
  viewModeIcon: z.coerce.string(z.enum(viewModeIcons)).optional(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "appearanceOrder",
    meta: {
      className: "w-2",
    },
    cell: ({ row }) => (
      <RowDragHandleCell rowId={row.original.customizedFormFieldId} />
    ),
  },
  {
    header: "Text",
    accessorKey: "fieldLabel",
    cell: ({ row }) => {
      const form = useFormContext();

      return (
        <FormField
          control={form.control}
          name={row.index + ".fieldLabel"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  },
  {
    header: "Type",
    accessorKey: "fieldType",
    cell: ({ row }) => {
      const form = useFormContext();

      return (
        <FormField
          control={form.control}
          name={row.index + ".fieldType"}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fieldType.map((type) => (
                    <SelectItem key={"fieldType-" + type} value={type}>
                      {capitalize(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  },
  {
    header: "Type",
    accessorKey: "fieldRepresentation",
    cell: ({ row }) => {
      const form = useFormContext();

      return (
        <FormField
          control={form.control}
          name={row.index + ".fieldRepresentation"}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select representation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fieldRepresentation.map((type) => (
                    <SelectItem
                      key={"fieldRepresentation-" + type}
                      value={type}
                    >
                      {capitalize(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  },
  {
    header: "View Mode Label",
    accessorKey: "viewModeLabel",
    cell: ({ row }) => {
      const form = useFormContext();

      return (
        <FormField
          control={form.control}
          name={row.index + ".viewModeLabel"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  },
  {
    header: "View Mode Icon",
    accessorKey: "viewModeIcon",
    cell: ({ row }) => {
      const form = useFormContext();
      const { siteUrl } = useApi();

      return (
        <FormField
          control={form.control}
          name={row.index + ".viewModeIcon"}
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4 items-center">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {viewModeIcons.map((type) => (
                      <SelectItem key={"viewModeIcon-" + type} value={type}>
                        <div className="flex gap-4">
                          <img
                            className="size-4"
                            loading="lazy"
                            src={`${siteUrl}/public-static/KPI/${type}.svg`}
                          />{" "}
                          {capitalize(type)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      );
    },
  },
];

export default function QuestionsTable() {
  const vendorId = useAdminState(useShallow((state) => state.vendorId));
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetVendorDetails(vendorId);
  const { mutateAsync, isPending } = useUpdateQaQuestionMutation(vendorId);
  const form = useForm({
    resolver: zodResolver(z.array(schema)),
  });

  const [values, setVals] = useState(
    {} as Record<number, z.infer<typeof schema>>,
  );
  const setValues = useDebouncedCallback(setVals, 200);

  const difference = useMemo(() => {
    if (!data?.questions || !values) {
      return undefined;
    }

    return Object.keys(values).reduce(
      (acc, k) => {
        const key = k as unknown as number;
        if (
          JSON.stringify(values[key]) !== JSON.stringify(data.questions[key])
        ) {
          if (!acc) {
            acc = [];
          }

          acc.push(values[key] as CustomizedFormField);
        }
        return acc;
      },
      undefined as undefined | CustomizedFormField[],
    );
  }, [data?.questions, values]);

  const onSort = (data: z.infer<typeof schema>[]) => {
    Object.keys(form.getValues()).forEach((key) => {
      const currFieldId = form.getValues()[key].customizedFormFieldId;
      const index = data.findIndex(
        ({ customizedFormFieldId }) => customizedFormFieldId === currFieldId,
      );

      form.setValue(key + ".appearanceOrder", index);
    });
  };

  const onSubmit = async () => {
    if (!difference) {
      toast.error("No changes to save");
      return;
    }

    const res = await Promise.allSettled(
      difference.map((field) => mutateAsync(field)),
    );

    res.forEach((r, i) => {
      if (r.status === "rejected") {
        toast.error(
          `Failed to save question ${difference[i].customizedFormFieldId}`,
        );
        return;
      }

      if (r.status === "fulfilled") {
        toast.success(`Question ${difference[i].customizedFormFieldId} saved`);
        queryClient.setQueryData<VendorDetailsResponse>(
          ["vendor-details", vendorId],
          (data) => {
            if (!data) {
              return undefined;
            }

            return {
              ...data,
              questions: data?.questions.map((q) => {
                if (
                  q.customizedFormFieldId ===
                  difference[i].customizedFormFieldId
                ) {
                  return difference[i];
                }
                return q;
              }),
            };
          },
        );
      }
    });
  };

  const reset = () => {
    form.reset(data?.questions);
  };

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => setValues(values));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (data?.questions) {
      form.reset(data.questions);
    }
  }, [data]);

  if (isLoading) {
    return <SkeletonTable cols={columns.length} rows={10} />;
  }

  if (!data?.questions) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DataTable
          columns={columns}
          data={data.questions}
          sort={{
            uniqueIdentifier: "customizedFormFieldId",
            onSort,
          }}
          renderSave={
            <div className="ml-auto flex gap-4">
              {difference && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={reset}
                    disabled={isPending}
                  >
                    Reset
                  </Button>
                  <Button isPending={isPending}>Save changes</Button>
                </>
              )}
            </div>
          }
        />
      </form>
    </Form>
  );
}
