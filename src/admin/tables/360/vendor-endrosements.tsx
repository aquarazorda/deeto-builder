import useGetVendorDetails from "@/queries/useGetVendorDetails";
import { useAdminState } from "@/state/admin";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Endorsement } from "@/admin/types/endorsements";
import { useForm, useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { VendorDetailsResponse } from "@/queries/useGetVendorDetails";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TableActionDropdown from "../utils/action-dropdown";
import { copyToClipboard } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateEndorsmentMutation from "@/queries/useUpdateEndorsementMutation";
import { toast } from "sonner";

const columns: ColumnDef<Endorsement>[] = [
  {
    header: "Endorsement",
    accessorKey: "value",
    cell: ({ row }) => {
      const form = useFormContext();

      return (
        <FormField
          name={row.index + ".value"}
          control={form.control}
          render={({ field }) => (
            <FormItem {...field}>
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
    id: "actions",
    cell: ({ row }) => {
      const { vendorId } = useAdminState();
      const queryClient = useQueryClient();
      const { mutateAsync, isPending } = useUpdateEndorsmentMutation(vendorId);
      const form = useFormContext();
      const [currVal, setCurrVal] = useState(row.original.value);

      useEffect(() => {
        const { unsubscribe } = form.watch((value, { name }) => {
          if (name === row.index + ".value") {
            setCurrVal(value[row.index].value);
          }
        });

        return unsubscribe;
      }, []);

      const onSave = async () => {
        const res = await mutateAsync({
          endorsementId: row.original.endorsmentId,
          vendorId: row.original.vendorId,
          value: currVal,
        });

        if (res) {
          toast.success("Endorsement updated");
          queryClient.setQueryData<VendorDetailsResponse>(
            ["vendor-details", vendorId],
            (data) => {
              if (!data) return undefined;

              return {
                ...data,
                endorsements: data.endorsements.map((endorsement) => {
                  if (endorsement.endorsmentId === row.original.endorsmentId) {
                    return {
                      ...endorsement,
                      value: currVal,
                    };
                  }
                  return endorsement;
                }),
              };
            },
          );
          return;
        }

        toast.error("Failed to update endorsement");
      };

      return (
        <div className="flex gap-2 justify-end items-center">
          <div className="w-16">
            {currVal !== row.original.value && (
              <Button isPending={isPending} onClick={onSave}>
                Save
              </Button>
            )}
          </div>

          <TableActionDropdown>
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.endorsmentId)}
            >
              Copy endorsement ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.vendorId)}
            >
              Copy vendor ID
            </DropdownMenuItem>
          </TableActionDropdown>
        </div>
      );
    },
  },
];

export default function VendorEndrosementsTable() {
  const { vendorId } = useAdminState();
  const { data, isLoading } = useGetVendorDetails(vendorId);
  const form = useForm({
    resolver: zodResolver(z.array(z.object({ value: z.string() }))),
  });

  useEffect(() => {
    if (data?.endorsements) {
      form.reset(data.endorsements.map(({ value }) => ({ value })));
    }
  }, [data]);

  if (isLoading) {
    return <SkeletonTable cols={3} rows={6} />;
  }

  if (!data) {
    return null;
  }

  return (
    <Form {...form}>
      <DataTable data={data.endorsements} columns={columns} className="px-2" />
    </Form>
  );
}
