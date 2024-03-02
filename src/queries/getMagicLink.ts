import { AccountContact } from "@/admin/types/account-contact";
import { CustomizedFormValues } from "@/admin/types/customized-form-values";
import { useApi } from "@/state/api";
import { useQuery } from "@tanstack/react-query";

export const useGetMagicLink = (email?: string) => {
  const { apiUrl } = useApi();

  return useQuery({
    queryKey: ["getMagicLink", email],
    queryFn: async () => {
      return fetch(
        apiUrl + "/v1/admin/getMagicLink?email=" + encodeURIComponent(email!),
      ).then((res) => res.json() as Promise<GetMagicLinkResponse>);
    },
    enabled: !!email,
  });
};

export type GetMagicLinkResponse = {
  data: Array<{
    magicLink: string;
    meDetails: {
      accountContacts: AccountContact[];
      accountId: string;
      accountContactId: string;
      authenticatedUserId: string;
      email: string;
      firstName: string;
      lastName: string;
      fullName: string;
      title: string;
      companyName: string;
      linkedInProfile: string;
      privileges: Array<string>;
      redeemableBalance: number;
      avatar?: {
        url?: string;
      };
      workSchedule: {
        workingDays: Array<string>;
        workStart: string;
        workEnd: string;
      };
      rewardsSettings: Array<any>;
      referrals: {
        total: number;
        qualified: number;
        won: number;
      };
      selfRegistered?: boolean;
      secondaryEmail?: string;
      customizedFormValues: CustomizedFormValues;
    };
    routeDetails: {
      userAccountId: string;
      authenticatedUserId: string;
      role: string;
      vendor: {
        vendorId: string;
        name: string;
        accountLevel: string;
        sendEmailOnBehalf: string;
        activationDate: string;
        defaultCreditAmountPerMeeting: number;
        avatarId: string;
        appLogoId: string;
        createdAt: string;
        updatedAt: string;
        appLogo: {
          url: string;
          type: string;
        };
      };
    };
  }>;
};
