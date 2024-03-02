import { AuthenticatedUser } from "./authenticated-user";

export type Notification = {
  notificationId: string;
  notificationType: string;
  heading: string;
  timestamp: string;
  caption: string;
  sendAt: string;
  isMarkedAsRead: boolean;
  callToAction: string;
  contextClassName: string;
  contextId: string;
  emailActivityId: string | null;
  authenticatedUserId: string;
  metadata: string | null;
  isVisibleInTray: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationContext = Notification & {
  authenticatedUser: AuthenticatedUser;
};
