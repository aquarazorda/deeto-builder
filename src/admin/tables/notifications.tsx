import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import SkeletonTable from "./skeleton-table";
import { Notification } from "../types/notification";
import { DataTable } from "@/components/ui/data-table";
import { useGetActivities } from "@/queries/useGetActivities";
import { useAdminState } from "@/state/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { NotificationContextDialogContent } from "../dialogs/notification-context";
import { copyToClipboard } from "@/lib/utils";

const columns: ColumnDef<Notification>[] = [
  {
    header: "Notification Type",
    accessorKey: "notificationType",
  },
  {
    header: "Heading",
    accessorKey: "heading",
  },
  {
    header: "Caption",
    accessorKey: "caption",
  },
  {
    header: "Time",
    accessorKey: "timestamp",
    cell: (row) => format(row.getValue() as string, "dd/MM/yyyy HH:mm"),
  },
  {
    header: "Context Type",
    accessorKey: "contextClassName",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Check context</Button>
            </DialogTrigger>
            <DialogContent>
              <NotificationContextDialogContent
                contextId={row.original.contextId}
              />
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {" "}
              <DropdownMenuItem
                onClick={() => copyToClipboard(row.original.notificationId)}
              >
                Copy notification ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  copyToClipboard(row.original.authenticatedUserId)
                }
              >
                Copy receiver ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => copyToClipboard(row.original.contextId)}
              >
                Copy context ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function NotificationsTable() {
  const { email, authenticatedUserId } = useAdminState();
  const { isLoading, data } = useGetActivities(email, authenticatedUserId);

  if (isLoading) {
    return <SkeletonTable cols={columns.length} />;
  }

  if (!data) {
    return null;
  }

  return <DataTable data={data.data?.notifications ?? []} columns={columns} />;
}
