import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHtml } from "@/state/html";
import { Form } from "@/state/panel";
import { Element } from "cheerio";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Form({ form }: { form: Form }) {
  const $ = useHtml(useShallow((state) => state.$));

  const getItem = (el: Element, groupId: number) => {
    const parent = $(el).parent();
    const isCheckbox = parent.hasClass("checkbox-wrapper");

    return {
      key: $(el).attr("name"),
      groupId,
      placeholder: $(el).attr("placeholder"),
      description: isCheckbox ? $(parent).find("p").text() : undefined,
    };
  };

  useEffect(() => {
    const formGroups = $(".form-inputs")
      .find(".form-group")
      .map((i, el) =>
        $(el)
          .find("input")
          .map((_, e) => getItem(e, i)),
      );

    const directInputs = $(".form-inputs")
      .find("input")
      .map((_, el) => getItem(el))
      .toArray();

    // console.log(
    //   formGroups.map((el) =>
    //     $(el)
    //       .find("input")
    //       .map((_, item) => getItem(item))
    //       .toArray(),
    //   ),
    // );

    // console.log(directInputs);
    console.log(formGroups.toArray());

    // const groupVals = formGroups.flatMap((el) => $(el).find("input")).;
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline">Add Section</Button>
      <Card>
        <CardHeader>
          <CardTitle>Available form elements</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {form.elements.map(({ title, key }) => (
            <Card key={key}>
              <CardContent className="col-auto px-4 py-2">{title}</CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
