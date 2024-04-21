import { useApi } from "@/state/api";
import { useMutation } from "@tanstack/react-query";

export default function useRemoveImageMutation() {
  const { apiUrl } = useApi();

  return useMutation({
    mutationKey: ["removeImage"],
    mutationFn: async (caseStudyImageId: string) => {
      return await fetch(apiUrl + "/v1/admin/removeImage", {
        body: JSON.stringify({ caseStudyImageId }),
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
