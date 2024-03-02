import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminState } from "@/state/admin";
import { ReactNode, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetActivities } from "@/queries/useGetActivities";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NotificationsTable from "./tables/notifications";
import { Separator } from "@/components/ui/separator";
import MeetingDetailsTable from "./tables/meeting-details";
import EmailActivitiesTable from "./tables/email-activities";

export const TooltipForDisabled = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {disabled && (
          <TooltipContent>
            <p>You need to select an account in order to see this data.</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const triggers = [
  {
    value: "notifications",
    label: "Notifications",
  },
  {
    value: "meetingDetails",
    label: "Meeting Details",
  },
  {
    value: "emailActivities",
    label: "Email Activities",
  },
];

export default function AdminMainTabs() {
  const ref = useRef<HTMLDivElement>(null);
  const { email, authenticatedUserId } = useAdminState();
  const { isLoading } = useGetActivities(email, authenticatedUserId);

  if (!authenticatedUserId) {
    return null;
  }

  return (
    <>
      <Separator />
      <Tabs
        defaultValue="notifications"
        className="w-full"
        onValueChange={() =>
          setTimeout(
            () => ref.current?.scrollIntoView({ behavior: "smooth" }),
            10,
          )
        }
      >
        <TabsList className="w-full">
          {triggers.map(({ value, label }) => (
            <TabsTrigger
              value={value}
              key={value}
              disabled={!authenticatedUserId || isLoading}
            >
              <TooltipForDisabled key={value} disabled={!authenticatedUserId}>
                <span className="flex gap-1 items-center">
                  {label}{" "}
                  {isLoading && <LoadingSpinner className="mr-2 size-3" />}
                </span>
              </TooltipForDisabled>
            </TabsTrigger>
          ))}
        </TabsList>
        <div ref={ref}>
          <TabsContent value="notifications">
            <NotificationsTable />
          </TabsContent>
          <TabsContent value="meetingDetails">
            <MeetingDetailsTable />
          </TabsContent>
          <TabsContent value="emailActivities">
            <EmailActivitiesTable />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
