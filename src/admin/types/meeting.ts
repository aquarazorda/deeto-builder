import { AccountContactWithAuthenticatedUser } from "./account-contact";

export type ScheduledTimeSlot = {
  scheduledTimeSlotId: string;
  duration: number;
  startTime: string;
  endTime: string;
  emailBody: string;
  acceptedAt: string;
  authenticatedUserId: string;
  rejectedByAuthenticatedUserId: string | null;
  meetingId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Meeting = {
  meetingId: string;
  vendorAggregatedStage: string;
  prospectAggregatedStage: string;
  referenceAggregatedStage: string;
  zoomMeetingId: string | null;
  zoomMeetingUUID: string | null;
  zoomMeetingJoinUrl: string | null;
  zoomMeetingStartTime: string | null;
  googleMeetingId: string | null;
  salesforceEngagementId: string | null;
  zoomAccountId: string | null;
  opportunityId: string;
  referenceContactId: string;
  prospectContactId: string;
  initiatorId: string;
  referenceAccountId: string;
  createdAt: string;
  updatedAt: string;
  prospectContact: AccountContactWithAuthenticatedUser;
  referenceContact: AccountContactWithAuthenticatedUser;
  scheduledTimeSlots: ScheduledTimeSlot[];
};
