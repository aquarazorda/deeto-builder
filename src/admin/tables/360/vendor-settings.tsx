import { Form } from "@/components/ui/form";
import { VendorSettings } from "@/admin/types/vendor";
import useGetVendorDetails from "@/queries/useGetVendorDetails";
import { useAdminState } from "@/state/admin";
import { ColumnDef } from "@tanstack/react-table";
import { useShallow } from "zustand/react/shallow";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormData } from "@/lib/form";
import DynamicFieldInput from "../utils/dynamic-field-input";
import GenericSaveButton from "../utils/generic-save-button";
import { Button } from "@/components/ui/button";
import { useUpdateVendorSettingsMutation } from "@/queries/useUpdateVendorSettingsMutation";
import { toast } from "sonner";

type VendorSettingsKey = keyof VendorSettings;

const columns: ColumnDef<{
  key: VendorSettingsKey;
  value: VendorSettings[VendorSettingsKey];
}>[] = [
  {
    header: "Key",
    accessorFn: (row) => row.key,
  },
  {
    header: "Value",
    accessorFn: (row) => row.value,
    meta: {
      className: "!pr-4 w-2/3",
    },
    cell: ({ row }) => {
      return <DynamicFieldInput row={row} />;
    },
  },
];

export default function VendorSettingsTable() {
  const vendorId = useAdminState(useShallow((state) => state.vendorId));
  const { data, isLoading } = useGetVendorDetails(vendorId);
  const { mutateAsync, isPending } = useUpdateVendorSettingsMutation();
  const {
    data: tableData,
    schema,
    defaultValues,
  } = useDynamicFormData<VendorSettings>(data?.vendorSettings);

  const form = useForm<VendorSettings>({
    resolver: schema && zodResolver(schema),
  });

  const [values, setValues] = useState<Partial<VendorSettings> | undefined>(
    defaultValues,
  );

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => setValues(values));

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <SkeletonTable cols={columns.length} rows={10} />;
  }

  if (!tableData) {
    return null;
  }

  const onSave = async (values: Partial<VendorSettings>) => {
    const res = await mutateAsync({ vendorId, ...values });
    if (res) {
      toast.success("Settings saved");
      return;
    }

    toast.error("Failed to save settings");
  };

  return (
    <Form {...form}>
      <DataTable
        data={tableData}
        columns={columns}
        renderSave={
          <GenericSaveButton
            title="Save settings"
            values={values}
            defaultValues={defaultValues}
            onSave={onSave}
            isPending={isPending}
            render={() => (
              <Button className="ml-auto" type="button">
                Check changes and save
              </Button>
            )}
          />
        }
      />
    </Form>
  );
}
