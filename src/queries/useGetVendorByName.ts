import { Vendor } from "@/admin/types/vendor";
import { useApi } from "@/state/api";
import { useQuery } from "@tanstack/react-query";

export default function useGetVendorByName(vendorName?: string) {
  const { apiUrl } = useApi();
  return useQuery({
    enabled: !!vendorName,
    queryKey: ["vendor-users", vendorName],
    queryFn: () =>
      fetch(`${apiUrl}/v1/admin/getVendorByName?name=${vendorName}`).then(
        (res) =>
          res.json() as Promise<{
            data: Vendor[];
          }>,
      ),
  });
}
