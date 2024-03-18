import { useApi } from "@/state/api";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateEndorsmentMutation(vendorId?: string) {
  const { apiUrl } = useApi();

  return useMutation({
    mutationKey: ["updateEndorsement", vendorId],
    mutationFn: async (field: {
      endorsementId: string;
      vendorId: string;
      value: string;
    }) => {
      if (!vendorId) {
        return false;
      }

      return await fetch(apiUrl + "/v1/admin/updateEndorsement", {
        body: JSON.stringify(field),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => res.code === 0);
    },
  });
}
