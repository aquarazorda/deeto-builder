export type AuthenticatedUser = {
  authenticatedUserId: string;
  username: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  salesforceId: string | null;
  email: string;
  headId: string;
  approvedEULA: boolean;
  userStatus: string;
  beforeLockedUserStatus: string | null;
  preferredTimezone: string;
  secondaryEmail: string | null;
  selfRegisteredAt: string | null;
  avatarId: string;
  createdBy: string;
  joinedAt: string;
  activeAt: string;
  lockedAt: string | null;
  lockedBy: string | null;
  languageId: string;
  createdAt: string;
  updatedAt: string;
};
