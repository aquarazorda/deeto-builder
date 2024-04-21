import { useApi } from "@/state/api";
import { useMutation } from "@tanstack/react-query";

type Props = {
  fileName: string;
  imagePath: string;
  imageType: "banner" | "square";
  vendorId: string;
};
export default function useAddImage() {
  const { apiUrl } = useApi();

  return useMutation({
    mutationFn: async (values: Props) => {
      const res = await fetch(`${apiUrl}/v1/admin/newImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json());

      if (res.message === "success") {
        return true;
      }

      return false;
    },
  });
}
