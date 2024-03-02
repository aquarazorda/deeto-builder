import { useAdminState } from "@/state/admin";
import VendorUsers from "./tables/360/vendor-users";
import VendorTabs from "./vendor-tabs";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Admin360() {
  const [vendorId, vendorName] = useAdminState(
    useShallow((state) => [state.vendorId, state.vendorName]),
  );

  if (!vendorName) {
    return null;
  }

  return (
    <div className="flex flex-1 space-x-2 border rounded w-full">
      <ScrollArea className="h-[88dvh] w-1/3 p-2">
        <VendorUsers />
      </ScrollArea>
      <ScrollArea className="h-[88dvh] w-full py-2 px-4">
        {vendorId && <VendorTabs />}
        {!vendorId && vendorName && (
          <span className="h-full text-center text-muted-foreground">
            Please select vendor account
          </span>
        )}
      </ScrollArea>
    </div>
  );
}
