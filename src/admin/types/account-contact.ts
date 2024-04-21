import { CustomizedFormValues } from "./customized-form-values";
import { AuthenticatedUser } from "./authenticated-user";

export type Account = {
  accountId: string;
  companyName: string;
  linkedInProfile: string | null;
  salesforceAccountId: string | null;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
};

export type VendorContactPrivilege = {
  vendorContactPrivilegesId: string;
  vendorContactId: string;
  vendorContactPrivilege: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountContact = {
  accountContactId: string;
  salesforceId: string | null;
  emailBody: string;
  title: string;
  publicNote: string | null;
  publicNoteAiResults: string | null;
  publicNoteUserInput: string | null;
  selectedReviewQuote: string | null;
  influenceLevel: string;
  often: string | null;
  linkedInProfile: string;
  g2ReviewUrl: string | null;
  frequency: number;
  redeemableAmount: number;
  authenticatedUserId: string;
  adminId: string;
  health: number;
  accountId: string;
  referralProgramId: string | null;
  encryptedId: string;
  createdAt: string;
  updatedAt: string;
  account: Account;
  customizedFormValues: CustomizedFormValues;
  vendorContactPrivileges?: VendorContactPrivilege[];
};

export type AccountContactWithAuthenticatedUser = AccountContact & {
  authenticatedUser: AuthenticatedUser;
};
