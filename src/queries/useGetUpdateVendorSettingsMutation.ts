import { VendorSettings } from "@/admin/types/vendor";
import type { VendorDetailsResponse } from "./useGetVendorDetails";
import { useApi } from "@/state/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetUpdateVendorSettingsMutation = () => {
  const { apiUrl } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateVendorSettings"],
    mutationFn: async (body: Partial<VendorSettings>) => {
      if (!body.vendorId) {
        return false;
      }

      const res = await fetch(apiUrl + "/v1/admin/updateVendorSettings", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (res.code === 0) {
        queryClient.setQueryData<VendorDetailsResponse>(
          ["vendor-details", body.vendorId],
          (data) => {
            if (!data) {
              return undefined;
            }

            return {
              ...data,
              vendorSettings: {
                ...data?.vendorSettings,
                ...body,
              },
            };
          },
        );
        return true;
      }

      return false;
    },
  });
};
