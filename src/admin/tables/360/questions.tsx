import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useGetVendorDetails from "@/queries/useGetVendorDetails";
import { useAdminState } from "@/state/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import {
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
  const { data, isLoading } = useGetVendorDetails(vendorId);
  const form = useForm({
    resolver: zodResolver(z.array(schema)),
  });

  const onSort = (data: z.infer<typeof schema>[]) => {
    Object.keys(form.getValues()).forEach((key) => {
      const currFieldId = form.getValues()[key].customizedFormFieldId;
      const index = data.findIndex(
        ({ customizedFormFieldId }) => customizedFormFieldId === currFieldId,
      );

      form.setValue(key + ".appearanceOrder", index);
    });
  };

  const onSubmit = () => {
    toast.info("Not implemented yet");
  };

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
            <>
              {form.getValues() !== data.questions && (
                <Button className="ml-auto">Save changes</Button>
              )}
            </>
          }
        />
      </form>
    </Form>
  );
}
