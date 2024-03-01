import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";

import { useAdminState } from "@/state/admin";
import { useShallow } from "zustand/react/shallow";
import AdminMainTabs from "./tabs";
import UserDetailsTable from "./tables/user-details";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function AdminMain() {
  const setAdminState = useAdminState(useShallow(({ set }) => set));

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
    reValidateMode: "onChange",
  });

  const onSubmit = async ({ email }: z.infer<typeof emailSchema>) => {
    setAdminState((state) => ({ ...state, email }));
  };

  return (
    <div className="w-full px-4 flex flex-col space-y-8 items-center">
      <Card className="w-fit">
        <CardContent className="flex justify-center items-center gap-4 p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-4 items-center"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormControl>
                      <Input
                        className="w-[300px]"
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!form.formState.isValid}>
                Get details
              </Button>
              <ModeToggle />
            </form>
          </Form>
        </CardContent>
      </Card>
      <UserDetailsTable />
      <AdminMainTabs />
    </div>
  );
}
