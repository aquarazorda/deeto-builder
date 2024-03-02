import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import SkeletonTable from "./skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import { useGetActivities } from "@/queries/useGetActivities";
import { useAdminState } from "@/state/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { NotificationContextDialogContent } from "../dialogs/notification-context";
import { Meeting } from "../types/meeting";
import { capitalize, copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const columns: ColumnDef<Meeting>[] = [
  {
    header: "Prospect",
    accessorFn: (row) =>
      `${row.prospectContact.authenticatedUser.firstName} ${row.prospectContact.authenticatedUser.lastName}`,
  },
  {
    header: "Reference",
    accessorFn: (row) =>
      `${row.referenceContact.authenticatedUser.firstName} ${row.referenceContact.authenticatedUser.lastName}`,
  },
  {
    header: "Status",
    accessorKey: "vendorAggregatedStage",
    cell: ({ getValue }) => capitalize(getValue() as string),
  },
  {
    header: "Time",
    cell: ({ row }) => {
      const data = row.original.scheduledTimeSlots;
      return (
        <div className="flex gap-2 flex-wrap">
          {data.map(({ startTime, endTime, status }) => (
            <TooltipProvider key={startTime}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={
                      status === "rejected" ? "destructive" : "secondary"
                    }
                  >
                    {format(startTime, "dd/MM/yyyy")}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}{" "}
                  {capitalize(status)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { set, authenticatedUserId, email } = useAdminState();
      const data = row.original;

      return (
        <div className="flex gap-2 items-center justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Check context</Button>
            </DialogTrigger>
            <DialogContent>
              <NotificationContextDialogContent
                contextId={row.original.meetingId}
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
              <DropdownMenuItem onClick={() => copyToClipboard(data.meetingId)}>
                Copy meeting ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const prospect = data.prospectContact;
                  if (
                    prospect.authenticatedUser.email === email ||
                    prospect.authenticatedUserId === authenticatedUserId
                  ) {
                    toast.info(
                      "You are already viewing this prospect's activities",
                    );
                    return;
                  }

                  set((state) => ({
                    ...state,
                    email: data.prospectContact.authenticatedUser.email,
                    authenticatedUserId:
                      row.original.prospectContact.authenticatedUserId,
                  }));
                }}
              >
                Check prospect's activities
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const reference = data.referenceContact;
                  if (
                    reference.authenticatedUser.email === email ||
                    reference.authenticatedUserId === authenticatedUserId
                  ) {
                    toast.info(
                      "You are already viewing this reference's activities",
                    );
                    return;
                  }

                  set((state) => ({
                    ...state,
                    email: reference.authenticatedUser.email,
                    authenticatedUserId: reference.authenticatedUserId,
                  }));
                }}
              >
                Check reference's activities
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function MeetingDetailsTable() {
  const { email, authenticatedUserId } = useAdminState();
  const { isLoading, data } = useGetActivities(email, authenticatedUserId);

  if (isLoading) {
    return <SkeletonTable cols={columns.length} />;
  }

  if (!data) {
    return null;
  }

  return <DataTable data={data.data?.meetings ?? []} columns={columns} />;
}
