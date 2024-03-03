import { useFormContext } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalize } from "@/lib/utils";
import { RowDragHandleCell } from "@/components/dnd/table-drag-cell";
import { Input } from "@/components/ui/input";
import { useApi } from "@/state/api";
import { z } from "zod";
import {
  fieldRepresentation,
  fieldType,
  viewModeIcons,
} from "@/admin/types/customized-form-values";

export const questionsSchema = z.object({
  customizedFormFieldId: z.string(),
  fieldLabel: z.string(),
  fieldType: z.enum(fieldType),
  fieldRepresentation: z.enum(fieldRepresentation),
  appearanceOrder: z.number(),
  viewModeLabel: z.nullable(z.string()),
  viewModeIcon: z.nullable(z.string(z.enum(viewModeIcons))),
});

export type QuestionsSchema = z.infer<typeof questionsSchema>;

export const questionColumns: ColumnDef<QuestionsSchema>[] = [
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
          key={row.index + ".fieldLabel"}
          control={form.control}
          name={row.index + ".fieldLabel"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  {...form.register(row.index + ".fieldLabel")}
                />
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
          key={row.index + ".fieldType"}
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
    header: "Representation",
    accessorKey: "fieldRepresentation",
    cell: ({ row }) => {
      const form = useFormContext();

      return (
        <FormField
          key={row.index + ".fieldRepresentation"}
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
          key={row.index + ".viewModeLabel"}
          name={row.index + ".viewModeLabel"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  {...form.register(row.index + ".viewModeLabel")}
                />
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
          key={row.index + ".viewModeIcon"}
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
