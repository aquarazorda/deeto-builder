import { useApi } from "@/state/api";
import { useMutation } from "@tanstack/react-query";

export default function useAddNewQaQuestionMutation(
  formType: string,
  vendorId?: string,
) {
  const { apiUrl } = useApi();

  return useMutation({
    mutationKey: ["addNewQaQuestion", formType, vendorId],
    mutationFn: async () => {
      if (!vendorId) return false;

      return await fetch(`${apiUrl}/v1/admin/newQaQuestion`, {
        body: JSON.stringify({ formType, vendorId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => res.message === "success");
    },
  });
}
