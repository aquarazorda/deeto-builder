import { NotificationContext } from "@/admin/types/notification";
import { useApi } from "@/state/api";
import { useQuery } from "@tanstack/react-query";

export default function getNotificationsByContext(contextId: string) {
  const { apiUrl } = useApi();

  return useQuery({
    queryKey: ["notification-context", contextId],
    queryFn: () =>
      fetch(
        apiUrl + "/v1/admin/notificationsByContextId?contextId=" + contextId,
      ).then((res) => res.json() as Promise<{ data: NotificationContext[] }>),
    enabled: !!contextId,
  });
}
