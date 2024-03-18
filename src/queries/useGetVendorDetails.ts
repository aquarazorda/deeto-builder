import { AccountContactWithAuthenticatedUser } from "@/admin/types/account-contact";
import { CustomizedFormField } from "@/admin/types/customized-form-values";
import { Endorsement } from "@/admin/types/endorsements";
import { VendorSettings } from "@/admin/types/vendor";
import { useApi } from "@/state/api";
import { useQuery } from "@tanstack/react-query";

export type VendorDetailsResponse = {
  vendorSettings: VendorSettings;
  questions: CustomizedFormField[];
  references: AccountContactWithAuthenticatedUser[];
  vendorContacts: AccountContactWithAuthenticatedUser[];
  endorsements: Endorsement[];
};

export default function useGetVendorDetails(vendorId?: string) {
  const { apiUrl } = useApi();

  return useQuery({
    enabled: !!vendorId,
    queryKey: ["vendor-details", vendorId],
    queryFn: () =>
      fetch(`${apiUrl}/v1/admin/getVendorDetails?vendorId=${vendorId}`)
        .then((res) => res.json() as Promise<{ data: VendorDetailsResponse }>)
        .then((res) => res.data),
  });
}
