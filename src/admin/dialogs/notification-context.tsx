import {
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { NotificationContext } from "../types/notification";
import { format } from "date-fns";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import getNotificationsByContext from "@/queries/getNotificationByContext";
import SkeletonTable from "../tables/skeleton-table";
import { copyToClipboard } from "@/lib/utils";

const columns: ColumnDef<NotificationContext>[] = [
  { header: "Notification Type", accessorKey: "notificationType" },
  { header: "Heading", accessorKey: "heading" },
  { header: "Caption", accessorKey: "caption" },
  {
    header: "Time",
    accessorKey: "timestamp",
    cell: (row) => format(row.getValue() as string, "dd/MM/yyyy HH:mm"),
  },
  { header: "Context Type", accessorKey: "contextClassName" },
  {
    header: "Received By",
    accessorFn: (row) =>
      `${row.authenticatedUser.firstName} ${row.authenticatedUser.lastName}`,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.notificationId)}
            >
              Copy notification ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.authenticatedUserId)}
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
      );
    },
  },
];

export const NotificationContextDialogContent = ({
  contextId,
}: {
  contextId: string;
}) => {
  const { data } = getNotificationsByContext(contextId);

  return (
    <>
      <DialogHeader>Context for notification</DialogHeader>
      {data ? (
        <DataTable columns={columns} data={data.data} maxHeight={606} />
      ) : (
        <SkeletonTable cols={columns.length} />
      )}
      <DialogFooter>
        <DialogClose>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};
