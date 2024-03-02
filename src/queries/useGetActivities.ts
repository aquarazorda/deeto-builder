import { EmailActivity } from "@/admin/types/email";
import { Meeting } from "@/admin/types/meeting";
import { Notification } from "@/admin/types/notification";
import { useApi } from "@/state/api";
import { useQuery } from "@tanstack/react-query";

type ActivitiesResponse = {
  data: {
    emailActivities: EmailActivity[];
    meetings: Meeting[];
    notifications: Notification[];
  };
};

const getActivities = async (
  apiUrl: string,
  email: string,
  authenticatedUserId: string,
) => {
  const res = await fetch(
    `${apiUrl}/v1/admin/userHistory?email=${email}&authenticatedUserId=${authenticatedUserId}`,
  );

  return res.json() as Promise<ActivitiesResponse>;
};

export type GetActivitiesType = ReturnType<typeof getActivities>;

export const useGetActivities = (
  email?: string,
  authenticatedUserId?: string,
) => {
  const { apiUrl } = useApi();

  return useQuery({
    queryKey: ["activities", email, authenticatedUserId],
    queryFn: () => getActivities(apiUrl, email!, authenticatedUserId!),
    enabled: !!email && !!authenticatedUserId,
  });
};
