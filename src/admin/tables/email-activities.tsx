import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import SkeletonTable from "./skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import { useGetActivities } from "@/queries/useGetActivities";
import { useAdminState } from "@/state/admin";

import { EmailActivity } from "../types/email";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useApi } from "@/state/api";
import { TooltipSimple } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

const columns: ColumnDef<EmailActivity>[] = [
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "From",
    accessorKey: "fromAddress",
  },
  {
    header: "To",
    accessorKey: "toAddress",
  },
  {
    header: "Template",
    accessorKey: "emailTemplate",
    meta: {
      className: "max-w-32 truncate",
    },
    cell: ({ getValue }) => (
      <TooltipSimple content={getValue() as string}>
        {getValue() as string}
      </TooltipSimple>
    ),
  },
  {
    header: "Time",
    accessorFn: (row) => format(row.sentTimeStamp, "dd/MM/yyyy HH:mm"),
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { siteUrl } = useApi();

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <EyeIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="py-8 px-12">
            <iframe
              src={`${siteUrl}/emailBody/${row.original.body}.html`}
              className="w-[80vw] h-[70dvh]"
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export default function EmailActivitiesTable() {
  const { email, authenticatedUserId } = useAdminState();
  const { isLoading, data } = useGetActivities(email, authenticatedUserId);

  if (isLoading) {
    return <SkeletonTable cols={columns.length} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataTable data={data.data?.emailActivities ?? []} columns={columns} />
  );
}
