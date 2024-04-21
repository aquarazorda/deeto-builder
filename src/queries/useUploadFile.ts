import { useApi } from "@/state/api";
import { useMutation } from "@tanstack/react-query";

export default function useUploadFile() {
  const { apiUrl } = useApi();

  return useMutation({
    mutationFn: async (file: File) => {
      const { signedUrl } = await fetch(`${apiUrl}/v1/admin/newSignedUrl`)
        .then((res) => res.json())
        .then(
          (res) =>
            res as {
              data: {
                signedUploadUrl: {
                  signedUrl: string;
                  uniqueId: string;
                };
              };
            },
        )
        .then(({ data }) => data.signedUploadUrl);

      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      return signedUrl;
    },
  });
}
