import { useAdminState } from "@/state/admin";
import VendorUsers from "./tables/360/vendor-users";
import VendorTabs from "./vendor-tabs";
import { useShallow } from "zustand/react/shallow";

export default function Admin360() {
  const vendorId = useAdminState(useShallow((state) => state.vendorId));
  return (
    <>
      <VendorUsers />
      {vendorId && <VendorTabs />}
    </>
  );
}
