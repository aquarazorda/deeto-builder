import { Form } from "@/components/ui/form";
import useGetVendorDetails, {
  VendorDetailsResponse,
} from "@/queries/useGetVendorDetails";
import { useAdminState } from "@/state/admin";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import SkeletonTable from "../skeleton-table";
import { DataTable } from "@/components/ui/data-table";
import { CustomizedFormField } from "@/admin/types/customized-form-values";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useDebouncedCallback from "@/lib/debounced-callback";
import useUpdateQaQuestionMutation from "@/queries/useUpdateQaQuestionMutation";
import { useQueryClient } from "@tanstack/react-query";
import {
  QuestionsSchema,
  questionColumns,
  questionsSchema,
} from "../columns/360-questions";
import useAddNewQaQuestionMutation from "@/queries/useAddNewQaQuestionMutation";

export default function QuestionsTable() {
  const vendorId = useAdminState(useShallow((state) => state.vendorId));
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetVendorDetails(vendorId);
  const { mutateAsync, isPending } = useUpdateQaQuestionMutation(vendorId);
  const { mutateAsync: addNew, isPending: isAddNewPending } =
    useAddNewQaQuestionMutation("Q&A", vendorId);

  const form = useForm({
    resolver: zodResolver(z.array(questionsSchema)),
  });

  const [values, setVals] = useState({} as Record<number, QuestionsSchema>);
  const setValues = useDebouncedCallback(setVals, 200);

  const difference = useMemo(() => {
    if (!data?.questions || !values) {
      return undefined;
    }

    return Object.keys(values).reduce(
      (acc, k) => {
        const key = k as unknown as number;
        if (
          JSON.stringify(values[key]) !== JSON.stringify(data.questions[key])
        ) {
          if (!acc) {
            acc = [];
          }

          acc.push(values[key] as CustomizedFormField);
        }
        return acc;
      },
      undefined as undefined | CustomizedFormField[],
    );
  }, [data, values]);

  const onSort = useCallback(
    (data: QuestionsSchema[]) => {
      form.reset(data);
    },
    [form, values],
  );

  const onSubmit = useCallback(async () => {
    if (!difference) {
      toast.error("No changes to save");
      return;
    }

    const res = await Promise.allSettled(
      difference.map((field) => mutateAsync(field)),
    );

    let fulfilled = true;

    res.forEach((r, i) => {
      if (r.status === "rejected") {
        toast.error(
          `Failed to save question ${difference[i].customizedFormFieldId}`,
        );
        fulfilled = false;
        return;
      }

      if (r.status === "fulfilled") {
        toast.success(`Question ${difference[i].customizedFormFieldId} saved`);
      }
    });

    if (fulfilled) {
      queryClient.setQueryData<VendorDetailsResponse>(
        ["vendor-details", vendorId],
        (data) => {
          if (!data) {
            return undefined;
          }

          const questions = Object.values(values) as CustomizedFormField[];

          return {
            ...data,
            questions,
          };
        },
      );
    }
  }, [difference, mutateAsync, queryClient, values, vendorId]);

  const add = async () => {
    const res = await addNew();

    if (res) {
      toast.success("Question added");
      queryClient.invalidateQueries({
        queryKey: ["vendor-details", vendorId],
        exact: true,
      });
    }
  };

  const reset = () => {
    form.reset(data?.questions);
  };

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => setValues(values));
    return unsubscribe;
  }, [form]);

  useEffect(() => {
    if (data?.questions) {
      reset();
    }
  }, [data]);

  if (isLoading) {
    return <SkeletonTable cols={questionColumns.length} rows={10} />;
  }

  if (!data?.questions) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DataTable
          key={JSON.stringify(data.questions)}
          columns={questionColumns}
          data={data.questions}
          state={{
            sorting: [{ id: "appearanceOrder", desc: false }],
          }}
          sort={{
            uniqueIdentifier: "customizedFormFieldId",
            onSort,
          }}
          renderSave={
            <div className="ml-auto flex gap-4">
              {difference && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={reset}
                    disabled={isPending}
                  >
                    Reset
                  </Button>
                  <Button isPending={isPending}>Save changes</Button>
                </>
              )}
              <Button isPending={isAddNewPending} type="button" onClick={add}>
                Add new
              </Button>
            </div>
          }
        />
      </form>
    </Form>
  );
}
