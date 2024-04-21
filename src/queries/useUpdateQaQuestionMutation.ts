import { CustomizedFormField } from "@/admin/types/customized-form-values";
import { useApi } from "@/state/api";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateQaQuestionMutation(vendorId?: string) {
  const { apiUrl } = useApi();
  return useMutation({
    mutationKey: ["updateQaQuestion", vendorId],
    mutationFn: async (field: CustomizedFormField) => {
      if (!vendorId) {
        return false;
      }

      return await fetch(apiUrl + "/v1/admin/updateQaQuestion", {
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
