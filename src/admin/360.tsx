import { useAdminState } from "@/state/admin";
import VendorUsers from "./tables/360/vendor-users";
import VendorTabs from "./vendor-tabs";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Admin360() {
  const [vendorId, vendorName] = useAdminState(
    useShallow((state) => [state.vendorId, state.vendorName]),
  );

  if (!vendorName) {
    return null;
  }

  return (
    <div className="divide-y-2 md:divide-y-0 grid grid-cols-1 gap-2 md:gap-0 md:grid-cols-4 space-x-2 border rounded w-full">
      <ScrollArea
        className={cn(
          "h-[80dvh] md:h-[88dvh] md:col-span-1 md:p-2",
          vendorId && "h-[30dvh]",
        )}
      >
        <VendorUsers />
      </ScrollArea>
      {vendorId && (
        <ScrollArea className="h-[50dvh] md:h-[88dvh] md:col-span-3 py-2 px-2 md:px-4">
          <VendorTabs />
        </ScrollArea>
      )}
    </div>
  );
}
