import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { GetMagicLinkResponse, useGetMagicLink } from "@/queries/getMagicLink";
import { ColumnDef } from "@tanstack/react-table";
import SkeletonTable from "./skeleton-table";
import { useAdminState } from "@/state/admin";
import { useShallow } from "zustand/react/shallow";
import { useApi } from "@/state/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { capitalize, copyToClipboard } from "@/lib/utils";

const columns: ColumnDef<GetMagicLinkResponse["data"][number]>[] = [
  {
    header: "First Name",
    accessorFn: (row) => row.meDetails.firstName,
  },
  {
    header: "Last Name",
    accessorFn: (row) => row.meDetails.lastName,
  },
  {
    header: "Vendor",
    accessorFn: (row) => row.routeDetails.vendor.name,
  },
  {
    header: "Role",
    accessorFn: (row) => capitalize(row.routeDetails.role),
  },
  {
    header: "Email",
    accessorFn: (row) => row.meDetails.email,
  },
  {
    id: "actions",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const { set } = useAdminState(useShallow(({ set }) => ({ set })));
      const { siteUrl } = useApi();
      const magicLink = siteUrl + "/m?l=" + row.original.magicLink;

      return (
        <div className="space-x-2 justify-end w-full flex items-center">
          <Button
            onClick={() =>
              set((state) => ({
                ...state,
                email: row.original.meDetails.email,
                authenticatedUserId: row.original.meDetails.authenticatedUserId,
              }))
            }
          >
            Load activities
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => copyToClipboard(magicLink)}>
                Copy magic link{" "}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  copyToClipboard(row.original.meDetails.authenticatedUserId)
                }
              >
                Copy authenticated user ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyToClipboard(magicLink)}>
                <a href={magicLink} target="_blank">
                  Log in as user{" "}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function UserDetailsTable() {
  const email = useAdminState(useShallow(({ email }) => email));
  const { data, isLoading } = useGetMagicLink(email);
  if (isLoading) {
    return <SkeletonTable cols={columns.length} rows={6} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataTable className="w-full" columns={columns} data={data.data ?? []} />
  );
}
