import { useAdminState } from "@/state/admin";
import SkeletonTable from "../skeleton-table";
import { ColumnDef } from "@tanstack/react-table";
import { AccountContactWithAuthenticatedUser } from "@/admin/types/account-contact";
import useGetVendorDetails from "@/queries/useGetVendorDetails";
import { DataTable } from "@/components/ui/data-table";
import { capitalize, copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TableActionDropdown from "../utils/action-dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/lib/local-storage";

const columns: ColumnDef<AccountContactWithAuthenticatedUser>[] = [
  {
    header: "Name",
    accessorFn: ({ authenticatedUser }) =>
      `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
  },
  {
    header: "Role",
    accessorFn: ({ vendorContactPrivileges }) =>
      capitalize(vendorContactPrivileges?.[0].vendorContactPrivilege),
  },
  {
    header: "Email",
    accessorFn: ({ authenticatedUser }) => authenticatedUser.email,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { set } = useAdminState();
      const { set: setLocalStorage } = useLocalStorage();

      return (
        <div className="flex gap-2 justify-end items-center">
          <Button
            type="button"
            onClick={() => {
              setLocalStorage("adminMode", "users");
              set({ set, email: row.original.authenticatedUser.email });
            }}
          >
            Select
          </Button>
          <TableActionDropdown>
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.authenticatedUserId)}
            >
              Copy contact ID
            </DropdownMenuItem>
          </TableActionDropdown>
        </div>
      );
    },
  },
];

export default function VendorContactsTable() {
  const { vendorId } = useAdminState();
  const { data, isLoading } = useGetVendorDetails(vendorId);

  if (isLoading) {
    return <SkeletonTable cols={3} rows={6} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataTable
      data={data.vendorContacts ?? []}
      columns={columns}
      className="px-2"
    />
  );
}
