import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import SkeletonTable from "./skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import { useGetActivities } from "@/queries/useGetActivities";
import { useAdminState } from "@/state/admin";

import { EmailActivity } from "../types/email";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useApi } from "@/state/api";

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
    accessorKey: "timestamp",
  },
  {
    header: "Template",
    accessorKey: "emailTemplate",
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
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost">
              <EyeIcon />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={"left"} className="w-[800px] h-[600px]">
            <iframe
              src={`${siteUrl}/emailBody/${row.original.body}.html`}
              className="w-[800px] h-[600px]"
            />
          </HoverCardContent>
        </HoverCard>
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
