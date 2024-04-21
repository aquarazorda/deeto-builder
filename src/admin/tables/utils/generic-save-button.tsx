import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  useForm,
  useFormContext,
} from "react-hook-form";
import { DrawDynamicInput } from "./dynamic-field-input";

type Props<T extends FieldValues> = {
  title: string;
  defaultValues?: T;
  values: T | undefined;
  isPending?: boolean;
  render: () => React.ReactNode;
  onSave: (values: T) => void;
};

export default function GenericSaveButton<
  T extends FieldValues,
  PForm extends FieldValues,
>({ title, defaultValues, values, isPending, render, onSave }: Props<T>) {
  const parentForm = useFormContext<PForm>();
  const [isOpen, setIsOpen] = useState(false);

  const difference = useMemo(() => {
    if (!defaultValues || !values) return undefined;

    return Object.keys(values).reduce(
      (acc, key) => {
        if (defaultValues[key] !== values?.[key]) {
          if (!acc) acc = {} as DefaultValues<T>;
          acc[key] = values?.[key];
        }

        return acc;
      },
      undefined as DefaultValues<any> | undefined,
    );
  }, [values, defaultValues]);

  const form = useForm<DefaultValues<typeof difference>>();

  useEffect(() => {
    form.reset(difference);
    if (!difference) setIsOpen(false);
  }, [difference]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{difference && render()}</DialogTrigger>
      {difference && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Finalize your changes and save them.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="grid gap-4 py-4"
              onSubmit={form.handleSubmit(onSave)}
            >
              {difference &&
                (Object.keys(difference) as (keyof T)[]).map((key) => (
                  <div
                    className="flex gap-2 justify-between w-full items-center"
                    key={key as string}
                  >
                    <FormField
                      name={key as string}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-5 items-center gap-4 space-y-0 w-full">
                          <FormLabel htmlFor="name" className="truncate">
                            {key as string}
                          </FormLabel>
                          <DrawDynamicInput
                            value={defaultValues?.[key]}
                            field={field}
                            readOnly
                            disabled
                            className="!mt-0 border-destructive"
                          />
                          <FormControl>
                            <DrawDynamicInput
                              field={field}
                              className="col-span-3 !mt-0 border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        parentForm.setValue(
                          key as Path<PForm>,
                          defaultValues![key],
                        )
                      }
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              <DialogFooter>
                <Button type="submit" isPending={isPending}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
