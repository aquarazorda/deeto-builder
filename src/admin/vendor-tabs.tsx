import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminState } from "@/state/admin";
import { useShallow } from "zustand/react/shallow";
import { TooltipForDisabled } from "./tabs";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetVendorDetails from "@/queries/useGetVendorDetails";
import VendorSettingsTable from "./tables/360/vendor-settings";
import { useRef } from "react";
import QuestionsTable from "./tables/360/questions";

const triggers = [
  { key: "settings", label: "Settings" },
  { key: "questions", label: "Questions" },
  { key: "kpis", label: "KPIs" },
  { key: "endorsements", label: "Endorsements" },
  { key: "images", label: "Images" },
  { key: "widgets", label: "Widgets" },
];

export default function VendorTabs() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const vendorId = useAdminState(useShallow((state) => state.vendorId));
  const { isLoading } = useGetVendorDetails(vendorId);

  return (
    <>
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="w-full">
          {triggers.map(({ key, label }) => (
            <TabsTrigger
              value={key}
              key={key}
              disabled={!vendorId || isLoading}
            >
              <TooltipForDisabled key={key} disabled={!vendorId}>
                <span className="flex gap-2 items-center">
                  {label}{" "}
                  {isLoading && <LoadingSpinner className="mr-2 size-3" />}
                </span>
              </TooltipForDisabled>
            </TabsTrigger>
          ))}
        </TabsList>
        <div ref={tabsRef}>
          <TabsContent value="settings">
            <VendorSettingsTable />
          </TabsContent>
          <TabsContent value="questions">
            <QuestionsTable />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
