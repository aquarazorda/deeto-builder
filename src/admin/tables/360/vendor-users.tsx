import useGetVendorByName from "@/queries/useGetVendorByName";
import { useAdminState } from "@/state/admin";
import SkeletonTable from "../skeleton-table";
import { ColumnDef } from "@tanstack/react-table";
import { Vendor } from "../../types/vendor";
import { capitalize, copyToClipboard } from "@/lib/utils";
import TableActionDropdown from "../utils/action-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const columns: ColumnDef<Vendor>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Account Level",
    accessorFn: ({ accountLevel }) => capitalize(accountLevel),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { set } = useAdminState();

      return (
        <div className="flex gap-2 justify-end items-center">
          <Button
            onClick={() =>
              set((state) => ({ ...state, vendorId: row.original.vendorId }))
            }
          >
            See Details
          </Button>
          <TableActionDropdown>
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

export default function VendorUsers() {
  const { vendorName } = useAdminState();
  const { data, isLoading } = useGetVendorByName(vendorName);

  if (isLoading) {
    return <SkeletonTable cols={columns.length} rows={6} />;
  }

  if (!data) {
    return null;
  }

  return <DataTable data={data.data} columns={columns} />;
}
